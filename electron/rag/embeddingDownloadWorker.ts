// electron/rag/embeddingDownloadWorker.ts
//
// Dedicated Worker thread for downloading HuggingFace ONNX embedding models.
// Uses @huggingface/transformers pipeline('feature-extraction') to pull models
// into the local cache directory and reports byte-aggregated progress.

import { parentPort } from 'worker_threads';
import { WhisperProgressAggregator } from '../audio/whisper/whisperProgressAggregator';

if (!parentPort) {
  throw new Error('embeddingDownloadWorker must be run as a Worker thread');
}

// @huggingface/transformers is ESM-only — dynamic import via new Function bypasses CommonJS transpile
async function loadTransformers(): Promise<{ pipeline: any; env: any }> {
  return (new Function('return import("@huggingface/transformers")')()) as any;
}

parentPort.on('message', async (msg: any) => {
  if (msg.type !== 'init') {
    parentPort!.postMessage({
      type: 'error',
      message: `Unknown message type: ${msg.type}`,
    });
    return;
  }

  const modelId: string = msg.modelId;
  const cacheDir: string = msg.cacheDir;
  const dtype: string = msg.dtype || 'q8';
  const expectedBytes = Number(msg.expectedBytes) || 0;

  if (!modelId) {
    parentPort!.postMessage({
      type: 'error',
      message: 'init.modelId is required for embedding model download',
    });
    return;
  }

  try {
    const { pipeline, env } = await loadTransformers();

    env.cacheDir = cacheDir;
    env.allowRemoteModels = true;

    console.log(`[embeddingDownloadWorker] Starting download for "${modelId}" into "${cacheDir}" (dtype: ${dtype})...`);

    const aggregator = new WhisperProgressAggregator(expectedBytes);

    await pipeline('feature-extraction', modelId, {
      dtype,
      progress_callback: (data: any) => {
        const { pct } = aggregator.update(data);
        if (pct === null) return;
        parentPort!.postMessage({
          type: 'progress',
          modelId,
          progress: pct,
        });
      },
    });

    console.log(`[embeddingDownloadWorker] Successfully downloaded and cached "${modelId}".`);
    parentPort!.postMessage({ type: 'ready' });
  } catch (err: any) {
    console.error(`[embeddingDownloadWorker] Failed to download "${modelId}":`, err?.message || err);
    parentPort!.postMessage({
      type: 'error',
      message: `Failed to download model: ${err?.message || String(err)}`,
    });
  }
});
