import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catPath = path.resolve(__dirname, '../../../dist-electron/electron/rag/embeddingCatalog.js');
const provPath = path.resolve(__dirname, '../../../dist-electron/electron/rag/embeddingDownloadProvider.js');

const { STATIC_EMBEDDING_MODELS, buildEmbeddingCatalog } = await import(pathToFileURL(catPath).href);
const {
  isEmbeddingModelCached,
  getEmbeddingModelsDir,
  getEmbeddingModelFiles,
} = await import(pathToFileURL(provPath).href);

test('STATIC_EMBEDDING_MODELS exposes localDownloadable models', () => {
  const downloadable = STATIC_EMBEDDING_MODELS.localDownloadable;
  assert.ok(Array.isArray(downloadable), 'localDownloadable should be an array');
  assert.ok(downloadable.length >= 5, 'should offer at least 5 local models');

  const bgeLarge = downloadable.find(m => m.id === 'Xenova/bge-large-en-v1.5');
  assert.ok(bgeLarge, 'BGE Large should be present');
  assert.equal(bgeLarge.dimensions, 1024);
  assert.equal(bgeLarge.downloadable, true);

  const bgeSmall = downloadable.find(m => m.id === 'Xenova/bge-small-en-v1.5');
  assert.ok(bgeSmall, 'BGE Small should be present');
  assert.equal(bgeSmall.dimensions, 384);
});

test('buildEmbeddingCatalog includes downloadable models under local when requested', () => {
  const catalog = buildEmbeddingCatalog({
    includeDownloadable: true,
    cachedEmbeddingModels: new Set(['Xenova/bge-small-en-v1.5']),
  });

  const local = catalog.find(p => p.id === 'local');
  assert.ok(local, 'local provider should be in catalog');
  assert.ok(local.models.length > 1, 'should have multiple models when downloadable included');

  const bgeSmall = local.models.find(m => m.id === 'Xenova/bge-small-en-v1.5');
  assert.ok(bgeSmall, 'bge-small should be in local models');
  assert.equal(bgeSmall.downloaded, true, 'bge-small should be marked downloaded from cache set');

  const bgeLarge = local.models.find(m => m.id === 'Xenova/bge-large-en-v1.5');
  assert.ok(bgeLarge, 'bge-large should be in local models');
  assert.equal(bgeLarge.downloaded, false, 'bge-large should not be marked downloaded');
});

test('embeddingDownloadProvider returns paths and handles missing cache cleanly', () => {
  const dir = getEmbeddingModelsDir();
  assert.ok(typeof dir === 'string' && dir.length > 0, 'models dir should be a non-empty string');

  const files = getEmbeddingModelFiles('Xenova/bge-small-en-v1.5');
  assert.ok(Array.isArray(files) && files.length >= 2, 'should list model files');

  // Should return false for non-existent model
  assert.equal(isEmbeddingModelCached('nonexistent/model'), false);
});
