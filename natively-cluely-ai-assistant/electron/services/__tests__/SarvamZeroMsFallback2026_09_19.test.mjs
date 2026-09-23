import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dist = (p) => path.join(__dirname, '../../../dist-electron/electron', p);

// Mock electron app / safeStorage as required by CredentialsManager
const electronPath = require.resolve('electron');
require.cache[electronPath] = {
  id: electronPath, filename: electronPath, loaded: true,
  exports: {
    app: { isReady: () => true, getPath: () => os.tmpdir(), getVersion: () => '0.0.0-test' },
    safeStorage: { isEncryptionAvailable: () => false },
  },
};

const { LLMHelper } = require(dist('LLMHelper.js'));

describe('Sarvam 0ms Fallback and Key Hierarchy', () => {
  let prevEnvSarvam;

  beforeEach(() => {
    prevEnvSarvam = process.env.SARVAM_API_KEY;
    process.env.SARVAM_API_KEY = 'test-sarvam-env-key';
  });

  afterEach(() => {
    if (prevEnvSarvam !== undefined) process.env.SARVAM_API_KEY = prevEnvSarvam;
    else delete process.env.SARVAM_API_KEY;
  });

  test('hasKeyForModel reports accurate in-memory key availability without network delay', () => {
    const helper = new LLMHelper();

    // Default model is Gemini, helper has no gemini key
    assert.equal(helper.hasKeyForModel('gemini-2.5-flash'), false);
    assert.equal(helper.hasKeyForModel('gpt-4o'), false);
    assert.equal(helper.hasKeyForModel('claude-3-5-sonnet-20241022'), false);

    // Sarvam is initialized from env
    assert.equal(helper.hasKeyForModel('sarvam-105b-conversations'), true);

    // After setting OpenAI key, gpt-4o has key
    helper.setOpenaiApiKey('sk-test-key-openai');
    assert.equal(helper.hasKeyForModel('gpt-4o'), true);

    // Clearing OpenAI key immediately updates hasKeyForModel
    helper.setOpenaiApiKey('');
    assert.equal(helper.hasKeyForModel('gpt-4o'), false);
  });

  test('setSarvamApiKey with empty string reverts to process.env.SARVAM_API_KEY', () => {
    process.env.SARVAM_API_KEY = 'backend-sarvam-key';
    const helper = new LLMHelper();

    // User sets their own key
    helper.setSarvamApiKey('user-custom-sarvam-key');
    assert.equal(helper.hasKeyForModel('sarvam-105b-conversations'), true);

    // User clears their key -> should revert to backend key, NOT null
    helper.setSarvamApiKey('');
    assert.equal(helper.hasKeyForModel('sarvam-105b-conversations'), true);
  });

  test('0ms fast-path streams from Sarvam when user selects model without an API key', async () => {
    const helper = new LLMHelper();
    helper.setModel('gpt-4o');

    // Verify user has no key for gpt-4o
    assert.equal(helper.hasKeyForModel('gpt-4o'), false);

    // Mock Sarvam chat completion stream
    let sarvamCalled = false;
    let receivedModel = '';
    helper.sarvamClient = {
      chat: {
        completions: {
          create: async (req) => {
            sarvamCalled = true;
            receivedModel = req.model;
            return (async function* () {
              yield { choices: [{ delta: { content: 'Sarvam ' } }] };
              yield { choices: [{ delta: { content: 'response' } }] };
            })();
          }
        }
      }
    };

    const chunks = [];
    for await (const chunk of helper.streamChat('Test question', undefined, '')) {
      chunks.push(chunk);
    }

    assert.equal(sarvamCalled, true, 'Sarvam client should have been called via 0ms fallback');
    assert.equal(receivedModel, 'sarvam-105b-conversations');
    assert.equal(chunks.join(''), 'Sarvam response');
  });

  test('0ms fast-path in generateResponse (non-streaming) uses Sarvam when user key is absent', async () => {
    const helper = new LLMHelper();
    helper.setModel('gpt-4o');

    let sarvamGenerateCalled = false;
    let receivedGenerateModel = '';
    helper.sarvamClient = {
      chat: {
        completions: {
          create: async (req) => {
            sarvamGenerateCalled = true;
            receivedGenerateModel = req.model;
            return {
              choices: [{ message: { content: 'Non-streaming Sarvam answer' } }]
            };
          }
        }
      }
    };

    const answer = await helper.chatWithGemini('Hello from non-streaming test');
    assert.equal(sarvamGenerateCalled, true);
    assert.equal(receivedGenerateModel, 'sarvam-105b-conversations');
    assert.equal(answer, 'Non-streaming Sarvam answer');
  });

  test('buildTextSpareRungs includes Sarvam AI when sarvamClient is available', () => {
    const helper = new LLMHelper();
    // Ensure sarvamClient is active
    assert.ok(helper.sarvamClient);

    const spares = helper.buildTextSpareRungs('Test user content', 'Test system prompt', 0);
    const sarvamRung = spares.find(s => s.id === 'sarvam');
    assert.ok(sarvamRung, 'Sarvam should be present in spare rungs list');
    assert.equal(sarvamRung.name, 'Sarvam AI');
  });
});
