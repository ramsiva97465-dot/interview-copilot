// electron/rag/__tests__/EmbeddingResolverMeetFlooFirst.test.mjs
//
// Provider PRIORITY. Before this, EmbeddingProviderResolver consulted only
// openaiKey/geminiKey/ollamaUrl — MeetFlooApiKey was never read at all, so a
// customer on a MeetFloo key fell through to Ollama or the bundled MiniLM model
// and got the weakest retrieval in the product while paying for the managed one.
//
// Order is asserted against buildCandidates() rather than resolve(), so the test
// makes no network calls and cannot pass for the wrong reason (a bogus cloud key
// failing its probe would let ANY ordering end up selecting MeetFloo).

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modPath = path.resolve(__dirname, '../../../dist-electron/electron/rag/EmbeddingProviderResolver.js');
const { EmbeddingProviderResolver } = await import(pathToFileURL(modPath).href);

const names = (config) => EmbeddingProviderResolver.buildCandidates(config).map(p => p.name);

describe('candidate ordering', () => {
  test('MeetFloo is probed FIRST when a MeetFloo key is present', () => {
    // The user's instruction: "if MeetFloo api exists then route through it
    // first, if it fails follow the chain".
    const order = names({
      MeetFlooApiKey: 'nk_live',
      openaiKey: 'sk-openai',
      geminiKey: 'gem-key',
      ollamaUrl: 'http://localhost:11434',
    });
    assert.equal(order[0], 'MeetFloo', `expected MeetFloo first, got ${order.join(' → ')}`);
  });

  test('the rest of the chain is preserved behind it', () => {
    const order = names({
      MeetFlooApiKey: 'nk_live',
      openaiKey: 'sk-openai',
      geminiKey: 'gem-key',
      ollamaUrl: 'http://localhost:11434',
    });
    assert.deepEqual(order, ['MeetFloo', 'openai', 'gemini', 'ollama']);
  });

  test('no MeetFloo key means the previous ordering is untouched', () => {
    const order = names({ openaiKey: 'sk-openai', geminiKey: 'gem-key' });
    assert.deepEqual(order, ['openai', 'gemini', 'ollama']);
  });

  test('a MeetFloo key alone still yields a usable candidate', () => {
    assert.deepEqual(names({ MeetFlooApiKey: 'nk_live' }), ['MeetFloo', 'ollama']);
  });

  test('a trial sentinel WITHOUT a trial token is not offered as a candidate', () => {
    // The sentinel is not a credential; without the token the provider cannot
    // authenticate, and offering it would just burn a probe before every index.
    assert.deepEqual(names({ MeetFlooApiKey: '__trial__' }), ['ollama']);
  });

  test('a trial sentinel WITH a trial token is offered first', () => {
    const order = names({ MeetFlooApiKey: '__trial__', MeetFlooTrialToken: 'MeetFloo_trial_abc' });
    assert.equal(order[0], 'MeetFloo');
  });

  test('an empty MeetFloo key is ignored rather than probed', () => {
    assert.deepEqual(names({ MeetFlooApiKey: '   ' }), ['ollama']);
  });
});

describe('space identity', () => {
  test('the MeetFloo candidate carries its own space, distinct from direct Voyage', () => {
    // Same model as the direct-Voyage provider now, but a different transport
    // with its own caps and formatting — so still its own space key, and still
    // not one any other provider can produce.
    const [MeetFloo] = EmbeddingProviderResolver.buildCandidates({ MeetFlooApiKey: 'nk_live' });
    assert.equal(MeetFloo.space, 'MeetFloo:voyage-4:2048');
    assert.equal(MeetFloo.dimensions, 2048);
    assert.notEqual(MeetFloo.space, 'voyage:voyage-4:2048');
  });
});

describe('privacy scope policy', () => {
  test('a policy denying cloud embeddings excludes MeetFloo too', () => {
    // MeetFloo is a CLOUD provider. Being the "managed" tier is not an exemption
    // from the user's own privacy policy — if OpenAI and Gemini are excluded for
    // sending content off-device, so is MeetFloo.
    const order = names({
      MeetFlooApiKey: 'nk_live',
      openaiKey: 'sk-openai',
      geminiKey: 'gem-key',
      providerDataScopes: { embeddings: false },
    });
    assert.ok(!order.includes('MeetFloo'), `MeetFloo must be excluded, got ${order.join(' → ')}`);
    assert.ok(!order.includes('openai'));
    assert.ok(!order.includes('gemini'));
    assert.deepEqual(order, ['ollama'], 'only the local-capable provider may remain');
  });

  test('a permissive policy leaves MeetFloo first', () => {
    const order = names({ MeetFlooApiKey: 'nk_live', providerDataScopes: { embeddings: true } });
    assert.equal(order[0], 'MeetFloo');
  });
});
