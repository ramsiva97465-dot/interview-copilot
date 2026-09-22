import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainPath = path.resolve(__dirname, '../../main.ts');
const mainSource = readFileSync(mainPath, 'utf8');

function wireConnectedStatus(stt, sendSttStatus) {
  const sttProvider = 'MeetFloo-pro';
  const speaker = 'interviewer';
  let consecutiveErrors = 0;
  let lastState = 'awaiting-audio';

  stt.on('error', (err) => {
    consecutiveErrors++;
    lastState = 'reconnecting';
    sendSttStatus({
      state: 'reconnecting',
      provider: sttProvider,
      error: err.message,
      channel: speaker,
      reconnectAttempts: consecutiveErrors,
    });
  });

  stt.on('connected', () => {
    consecutiveErrors = 0;
    if (lastState !== 'connected') {
      lastState = 'awaiting-audio';
      sendSttStatus({
        state: 'awaiting-audio',
        provider: sttProvider,
        channel: speaker,
      });
    }
  });

  stt.on('transcript', (segment) => {
    if (segment.isFinal) {
      consecutiveErrors = 0;
      if (lastState !== 'connected') {
        lastState = 'connected';
        sendSttStatus({
          state: 'connected',
          provider: sttProvider,
          channel: speaker,
        });
      }
    }
  });
}

test('production MeetFlooProSTT wiring maps handshake connected to awaiting-audio', () => {
  const MeetFlooBlockMatch = /if \(stt instanceof MeetFlooProSTT\) \{([\s\S]*?)\n    \}/.exec(mainSource);
  assert.ok(MeetFlooBlockMatch, 'could not locate MeetFlooProSTT-specific wiring block in main.ts');

  const MeetFlooBlock = MeetFlooBlockMatch[1];
  assert.ok(/stt\.on\(\s*['"]connected['"]/.test(MeetFlooBlock), 'BUG: main.ts must listen for MeetFlooProSTT connected events.');
  assert.ok(/_consecutiveErrors\s*=\s*0/.test(MeetFlooBlock), 'BUG: connected handshake must reset consecutive STT errors.');
  assert.ok(/_lastState\s*=\s*['"]awaiting-audio['"]/.test(MeetFlooBlock), 'BUG: connected handshake must enter awaiting-audio, not connected.');
  assert.ok(/state\s*:\s*['"]awaiting-audio['"]/.test(MeetFlooBlock), 'BUG: connected handshake must broadcast awaiting-audio.');
  assert.ok(!/stt\.on\(\s*['"]connected['"][\s\S]*?state\s*:\s*['"]connected['"]/.test(MeetFlooBlock), 'BUG: handshake connected must not broadcast verified connected status.');
});

test('MeetFlooProSTT connected event clears reconnecting status back to awaiting audio without waiting for a final transcript', () => {
  const stt = new EventEmitter();
  const statuses = [];
  wireConnectedStatus(stt, (status) => statuses.push(status));

  stt.emit('error', new Error('WebSocket closed unexpectedly'));
  stt.emit('connected', { provider: 'MeetFloo-pro', channel: 'system' });

  assert.deepEqual(statuses.map((status) => status.state), ['reconnecting', 'awaiting-audio']);
  assert.equal(statuses.at(-1)?.reconnectAttempts, undefined);
});

test('MeetFlooProSTT connected event resets consecutive errors for later failures', () => {
  const stt = new EventEmitter();
  const statuses = [];
  wireConnectedStatus(stt, (status) => statuses.push(status));

  stt.emit('error', new Error('first outage'));
  stt.emit('connected', { provider: 'MeetFloo-pro', channel: 'system' });
  stt.emit('error', new Error('second outage'));

  assert.deepEqual(statuses.map((status) => status.state), ['reconnecting', 'awaiting-audio', 'reconnecting']);
  assert.equal(statuses.at(-1)?.reconnectAttempts, 1);
});

test('final transcript still marks connected when no handshake event was observed', () => {
  const stt = new EventEmitter();
  const statuses = [];
  wireConnectedStatus(stt, (status) => statuses.push(status));

  stt.emit('error', new Error('first outage'));
  stt.emit('transcript', { text: 'hello', isFinal: true, confidence: 1 });

  assert.deepEqual(statuses.map((status) => status.state), ['reconnecting', 'connected']);
});
