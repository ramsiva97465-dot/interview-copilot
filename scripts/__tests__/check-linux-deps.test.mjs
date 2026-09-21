import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLinuxDeps } from '../check-linux-deps.js';

test('checkLinuxDeps does nothing on non-linux platforms', () => {
  if (process.platform !== 'linux') {
    assert.doesNotThrow(() => checkLinuxDeps());
  }
});
