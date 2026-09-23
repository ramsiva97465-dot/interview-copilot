import { _electron as electron } from '@playwright/test';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';

// Own userData dir so the E2E instance gets its OWN single-instance lock and
// never collides with a real MeetFloo app the user may be running.
const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'MeetFloo-e2e-udd-'));
const LOCAL_TOKEN = 'local-test-e2e-token';

const app = await electron.launch({
  args: ['dist-electron/electron/main.js', `--user-data-dir=${userDataDir}`],
  env: {
    ...process.env,
    MEETFLOO_E2E: '1',
    MEETFLOO_API_URL: 'http://localhost:3000',
    MEETFLOO_E2E_LOCAL_TEST_TOKEN: LOCAL_TOKEN,
    MEETFLOO_TEST_USERDATA: userDataDir,
    NODE_ENV: 'test',
    MEETFLOO_DEV_BYPASS_SCREEN_TCC: '1',
    MEETFLOO_OKF_PROFILE_PACKS: '1',
    MEETFLOO_OKF_PROFILE_HYBRID_RETRIEVAL: '1',
  },
  timeout: 60000,
});
console.log('BOOT: app launched, userData=' + userDataDir);
const win = await app.firstWindow({ timeout: 30000 });
console.log('BOOT: first window title=' + await win.title().catch(() => '(none)'));
const R = async (ch, ...a) => win.evaluate(async ({ ch, a }) => (window.electronAPI || window.api).e2eInvoke(ch, ...a), { ch, a });
const pro = await R('__e2e__:enable-pro').catch(e => 'err:' + e.message);
console.log('BOOT: enable-pro=' + JSON.stringify(pro));
const state = await R('__e2e__:profile-state').catch(e => 'err:' + e.message);
console.log('BOOT: profile-state=' + JSON.stringify(state));
await app.close();
console.log('BOOT: closed cleanly');
try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { /* ignore */ }
