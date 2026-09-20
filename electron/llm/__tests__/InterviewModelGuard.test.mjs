import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dist = (p) => path.join(__dirname, '../../../dist-electron/electron', p);

const { InterviewModelGuard } = require(dist('llm/InterviewModelGuard.js'));

describe('InterviewModelGuard Capability & Fast Auto-Switch', () => {
  test('isHighLatencyModel correctly identifies Pro and reasoning models with >3s TTFT', () => {
    // High-latency models (unsuitable for live interviews)
    assert.equal(InterviewModelGuard.isHighLatencyModel('antigravity:gemini-3.1-pro-low'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('antigravity:gemini-1.5-pro'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gemini-3.1-pro-preview'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gemini-pro'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('o1'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('o1-preview'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('o3-mini'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('claude-3-opus-20240229'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('deepseek-reasoner'), true);
    assert.equal(InterviewModelGuard.isHighLatencyModel('deepseek-r1'), true);

    // Fast models (<1.5s TTFT, interview-capable)
    assert.equal(InterviewModelGuard.isHighLatencyModel('antigravity:gemini-2.5-flash'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gemini-3.8-flash'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gemini-2.5-flash'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gemini-3.1-flash-lite'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('sarvam-105b-conversations'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('qwen/qwen3.6-27b'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gpt-4o'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('gpt-4o-mini'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('claude-3-5-sonnet'), false);
    assert.equal(InterviewModelGuard.isHighLatencyModel('claude-sonnet-4-6'), false);
  });

  test('inspectAndResolve leaves already-capable fast models untouched', () => {
    const mockHelper = { hasKeyForModel: () => true };
    const res = InterviewModelGuard.inspectAndResolve('gemini-3.8-flash', mockHelper);
    assert.equal(res.isCapable, true);
    assert.equal(res.isAdjusted, false);
    assert.equal(res.recommendedModel, 'gemini-3.8-flash');
  });

  test('inspectAndResolve fast-switches Antigravity Pro to Antigravity Flash', () => {
    const mockHelper = { hasKeyForModel: () => true };
    const res = InterviewModelGuard.inspectAndResolve('antigravity:gemini-3.1-pro-low', mockHelper);
    assert.equal(res.isCapable, false);
    assert.equal(res.isAdjusted, true);
    assert.ok(res.recommendedModel.includes('flash'));
    assert.ok(res.reason.includes('latency') || res.reason.includes('Flash'));
  });

  test('inspectAndResolve fast-switches Gemini Pro to Gemini Flash', () => {
    const mockHelper = { hasKeyForModel: () => true };
    const res = InterviewModelGuard.inspectAndResolve('gemini-3.1-pro-preview', mockHelper);
    assert.equal(res.isCapable, false);
    assert.equal(res.isAdjusted, true);
    assert.ok(res.recommendedModel.includes('flash'));
  });

  test('inspectAndResolve fast-switches OpenAI reasoning model (o1) to conversational model', () => {
    const mockHelper = { hasKeyForModel: () => true };
    const res = InterviewModelGuard.inspectAndResolve('o1', mockHelper);
    assert.equal(res.isCapable, false);
    assert.equal(res.isAdjusted, true);
    assert.equal(res.recommendedModel, 'gpt-4o');
  });

  test('inspectAndResolve auto-detects and fast-switches during copilot/meeting entry', () => {
    // If a candidate had saved a Pro model or unkeyed model, entering copilot auto-resolves it
    const mockHelper = { hasKeyForModel: (model) => model.includes('gemini') || model.includes('sarvam') };
    
    // Pro model saved as default
    const entryCheckPro = InterviewModelGuard.inspectAndResolve('antigravity:gemini-3.1-pro-low', mockHelper);
    assert.equal(entryCheckPro.isAdjusted, true);
    assert.ok(entryCheckPro.recommendedModel.includes('flash'));

    // Model with missing API key saved as default
    const entryCheckUnkeyed = InterviewModelGuard.inspectAndResolve('claude-3-5-sonnet', mockHelper);
    assert.equal(entryCheckUnkeyed.isAdjusted, true);
    assert.equal(entryCheckUnkeyed.recommendedModel, 'sarvam-105b-conversations');

    // Fast keyed model saved as default
    const entryCheckFast = InterviewModelGuard.inspectAndResolve('gemini-3.8-flash', mockHelper);
    assert.equal(entryCheckFast.isAdjusted, false);
    assert.equal(entryCheckFast.recommendedModel, 'gemini-3.8-flash');
  });
});

