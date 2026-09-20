// electron/rag/embeddingDownloadProvider.ts
//
// LocalModelDownloadProvider implementation for Hugging Face ONNX embedding models.
// Enables downloading, progress tracking, cancellation, and verification for local RAG models.

import path from 'path';
import fs from 'fs';
import { Worker } from 'worker_threads';
import { app } from 'electron';
import type { LocalModelDownloadProvider } from '../services/LocalModelDownloadService';
import { resolveBundledScript } from './resolveRagWorker';
import { STATIC_EMBEDDING_MODELS } from './embeddingCatalog';

/** Fallback userData path when app.getPath('userData') is not yet available. */
function fallbackUserDataDir(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '';
  if (process.platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'natively');
  }
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    return path.join(appData, 'natively');
  }
  return path.join(home, '.config', 'natively');
}

/**
 * Returns the directory where downloaded embedding models are cached.
 * Uses electron app.getPath('userData') so models persist across app updates.
 */
export function getEmbeddingModelsDir(): string {
  if (process.env.NATIVELY_LOCAL_MODELS_PATH) {
    return process.env.NATIVELY_LOCAL_MODELS_PATH;
  }
  try {
    const userData = app?.getPath?.('userData');
    if (userData) return path.join(userData, 'embedding-models');
  } catch {
    /* app not ready */
  }
  return path.join(fallbackUserDataDir(), 'embedding-models');
}

/**
 * Checks if a given embedding model has its required files (tokenizer and ONNX weights)
 * present on disk with valid file sizes.
 */
export function isEmbeddingModelCached(modelId: string): boolean {
  if (modelId === 'Xenova/all-MiniLM-L6-v2') {
    // The bundled model is always present in packaged resources or dev tree
    return true;
  }

  const baseDir = getEmbeddingModelsDir();
  const modelDir = path.join(baseDir, ...modelId.split('/'));

  if (!fs.existsSync(modelDir)) {
    return false;
  }

  // Check for tokenizer files
  const hasTokenizer = (
    (fs.existsSync(path.join(modelDir, 'tokenizer.json')) && statSize(path.join(modelDir, 'tokenizer.json')) > 0) ||
    (fs.existsSync(path.join(modelDir, 'tokenizer_config.json')) && statSize(path.join(modelDir, 'tokenizer_config.json')) > 0)
  );

  if (!hasTokenizer) return false;

  // Check for ONNX model files (quantized or regular)
  const candidateWeights = [
    path.join(modelDir, 'onnx', 'model_quantized.onnx'),
    path.join(modelDir, 'onnx', 'model.onnx'),
    path.join(modelDir, 'model_quantized.onnx'),
    path.join(modelDir, 'model.onnx'),
  ];

  return candidateWeights.some(w => fs.existsSync(w) && statSize(w) > 0);
}

function statSize(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

/**
 * Returns candidate model file paths expected for a downloaded model.
 */
export function getEmbeddingModelFiles(modelId: string): string[] {
  const baseDir = getEmbeddingModelsDir();
  const modelDir = path.join(baseDir, ...modelId.split('/'));
  return [
    path.join(modelDir, 'tokenizer.json'),
    path.join(modelDir, 'onnx', 'model_quantized.onnx'),
  ];
}

/**
 * Deletes downloaded model files from the embedding models cache directory.
 */
export function deleteEmbeddingModel(modelId: string): void {
  if (modelId === 'Xenova/all-MiniLM-L6-v2') {
    // Never delete the bundled model
    return;
  }
  const baseDir = getEmbeddingModelsDir();
  const modelDir = path.join(baseDir, ...modelId.split('/'));
  try {
    if (fs.existsSync(modelDir)) {
      fs.rmSync(modelDir, { recursive: true, force: true });
      console.log(`[embeddingDownloadProvider] Deleted model directory: ${modelDir}`);
    }
  } catch (err: any) {
    console.warn(`[embeddingDownloadProvider] Failed to delete ${modelDir}:`, err?.message || err);
  }
}

/**
 * Creates the LocalModelDownloadProvider for embedding models.
 */
export function createEmbeddingDownloadProvider(): LocalModelDownloadProvider {
  return {
    name: 'embedding',

    isModelCached(modelId: string): boolean {
      return isEmbeddingModelCached(modelId);
    },

    deletePartial(modelId: string): void {
      deleteEmbeddingModel(modelId);
    },

    preflightCheck(): string | null {
      // No platform-specific OS block for embeddings
      return null;
    },

    spawnWorker(): Worker {
      const scriptPath = resolveBundledScript(__dirname, ['rag', 'embeddingDownloadWorker.js'], {
        unpackFromAsar: true,
      });
      return new Worker(scriptPath);
    },

    buildInitMessage(modelId: string): unknown {
      const catalogEntry = (STATIC_EMBEDDING_MODELS as any).localDownloadable?.find(
        (m: any) => m.id === modelId
      );
      const expectedBytes = (catalogEntry?.sizeMb ?? 100) * 1024 * 1024;
      return {
        type: 'init',
        modelId,
        cacheDir: getEmbeddingModelsDir(),
        dtype: 'q8',
        expectedBytes,
      };
    },
  };
}
