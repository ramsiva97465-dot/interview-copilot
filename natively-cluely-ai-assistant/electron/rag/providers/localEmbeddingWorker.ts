// electron/rag/providers/localEmbeddingWorker.ts
//
// Worker-thread host for LocalEmbeddingProvider's ONNX inference. Mirrors the
// exact pattern the (since removed) intent classifier worker used.
//
// WHY (2026-07-05 SIGTRAP crash hardening): 9/9 real macOS crash reports
// showed the app crashing on the MAIN THREAD inside ONNX Runtime's BFC
// allocator during a live InferenceSession::Run() call — consistent with
// multiple ONNX sessions (Whisper STT worker + reranker worker +
// this local-embedding fallback) being concurrently active in-process. The
// embedding fallback was the only one of the three still running its
// pipeline()/inference DIRECTLY on the main process, so it is moved into its
// own worker_threads.Worker here, matching the isolation the other two
// already had. Also applies bounded intra/inter-op thread counts (see
// electron/utils/onnxThreadConfig.ts) to reduce native thread/memory
// pressure even when multiple sessions are concurrently active.
//
// Message protocol:
//   { type: 'init', requestId, isPackaged, localModelPath, cacheDir }
//     -> { type: 'ready', requestId } | { type: 'error', requestId, error }
//   { type: 'embed', requestId, texts: string[] }
//     -> { type: 'result', requestId, vectors: number[][] } | { type: 'error', requestId, error }

import { parentPort } from 'worker_threads';
import { getBoundedOnnxSessionOptions } from '../../utils/onnxThreadConfig';
import { classifyWorkerFailure } from '../../utils/workerStatus';

if (!parentPort) throw new Error('localEmbeddingWorker must be run as a Worker thread');

const DEFAULT_MODEL_ID = 'Xenova/all-MiniLM-L6-v2';
const DEFAULT_DIMENSIONS = 384;

let pipe: any = null;
let activeModelId = DEFAULT_MODEL_ID;
let activeDimensions = DEFAULT_DIMENSIONS;
let loadingPromise: Promise<void> | null = null;

// @huggingface/transformers is ESM-only — must use a true dynamic import().
// `new Function` keeps this opaque to TypeScript's commonjs rewrite (which
// would otherwise turn `import()` into `require()` and fail for an ESM-only
// package). See LocalEmbeddingProvider.ts for the full explanation.
async function loadTransformers(): Promise<{ pipeline: any; env: any }> {
  return (new Function('return import("@huggingface/transformers")')()) as any;
}

async function ensureLoaded(msg: any): Promise<void> {
  const targetModelId = msg.modelId || DEFAULT_MODEL_ID;
  if (pipe && activeModelId === targetModelId) return;
  if (loadingPromise) return loadingPromise;

  activeModelId = targetModelId;
  activeDimensions = msg.dimensions || DEFAULT_DIMENSIONS;

  loadingPromise = (async () => {
    const { pipeline, env } = await loadTransformers();

    env.allowRemoteModels = false;
    env.localModelPath = msg.modelPath;

    console.log(`[LocalEmbeddingWorker] Loading feature-extraction model (${activeModelId})...`);
    pipe = await pipeline('feature-extraction', activeModelId, {
      local_files_only: true,
      // dtype MUST be explicit on transformers.js v3. v2 defaulted to the
      // quantized variant; v3 ignores `quantized` and defaults to fp32, so a
      // bare pipeline() call asks for onnx/model.onnx — while the installer
      // ships onnx/model_quantized.onnx and NOTHING else (see
      // LocalFallbackAssets.ts and scripts/verify-packaged-local-assets.mjs).
      // In a packaged build that is local_files_only, so the load fails and the
      // feature silently degrades. scripts/download-models.js already documents
      // this trap for the DOWNLOAD side; these consumers were missed.
      // localRerankerWorker already passes `dtype: msg.dtype || 'q8'`.
      dtype: msg.dtype || 'q8',
      session_options: getBoundedOnnxSessionOptions(),
    });
    console.log(`[LocalEmbeddingWorker] Feature-extraction model (${activeModelId}) loaded successfully.`);
    parentPort!.postMessage({ type: 'status', status: { type: 'ready', backend: 'onnx', modelPath: msg.modelPath } });
  })();

  try {
    await loadingPromise;
  } catch (e) {
    loadingPromise = null;
    pipe = null;
    const failure = classifyWorkerFailure(e);
    parentPort!.postMessage({
      type: 'status',
      status: {
        type: failure.recoverable ? 'degraded' : 'failed',
        backend: 'none',
        reason: failure.reason,
        message: failure.message,
        recoverable: failure.recoverable,
      },
    });
    throw e;
  }
}

parentPort.on('message', async (msg: any) => {
  try {
    if (msg.type === 'init') {
      await ensureLoaded(msg);
      parentPort!.postMessage({ type: 'ready', requestId: msg.requestId });
      return;
    }

    if (msg.type === 'embed') {
      if (!pipe) {
        await ensureLoaded(msg);
      }
      const texts: string[] = msg.texts;
      const output = await pipe(texts, { pooling: 'mean', normalize: true });
      const batchSize = texts.length;
      const dims = output.dims ? output.dims[output.dims.length - 1] : (msg.dimensions || activeDimensions);
      const vectors: number[][] = [];
      for (let i = 0; i < batchSize; i++) {
        vectors.push(Array.from(output.data.slice(i * dims, (i + 1) * dims)) as number[]);
      }
      parentPort!.postMessage({ type: 'result', requestId: msg.requestId, vectors });
      return;
    }

    parentPort!.postMessage({
      type: 'error',
      requestId: msg.requestId,
      error: `Unknown message type: ${msg.type}`,
    });
  } catch (e: any) {
    parentPort!.postMessage({
      type: 'error',
      requestId: msg.requestId,
      error: e?.message || String(e),
    });
  }
});
