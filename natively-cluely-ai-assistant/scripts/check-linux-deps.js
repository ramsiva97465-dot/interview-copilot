/**
 * Preflight check for Linux system dependencies required by Electron and concurrently.
 * 
 * Checks for:
 *   1. `ps` utility (from `procps` package), required by `concurrently --kill-others` / `tree-kill`.
 *   2. Shared GUI libraries (e.g., `libglib-2.0.so.0`, `libnss3`, `libgtk-3-0`) required by Chromium / Electron binary on Linux.
 *   3. X11 display environment ($DISPLAY or Xvfb) when launching Electron in GUI mode.
 */
const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function checkLinuxDeps() {
  if (process.platform !== 'linux') {
    return;
  }

  console.log('[check-linux-deps] Verifying Linux system dependencies...');
  let hasErrors = false;

  // 1. Check for `ps` command
  try {
    execSync('which ps', { stdio: 'ignore' });
  } catch {
    console.error('\n❌ [check-linux-deps] Missing system utility: `ps`');
    console.error('   `concurrently` and `tree-kill` require `ps` to manage child processes.');
    console.error('   Fix by installing `procps`:');
    console.error('     Debian/Ubuntu: apt-get update && apt-get install -y procps');
    console.error('     Alpine:        apk add procps\n');
    hasErrors = true;
  }

  // 2. Check Electron shared libraries
  const root = path.resolve(__dirname, '..');
  const electronBin = path.join(root, 'node_modules', 'electron', 'dist', 'electron');

  if (fs.existsSync(electronBin)) {
    try {
      execFileSync(electronBin, ['-v'], { stdio: 'pipe', timeout: 5000 });
    } catch (err) {
      const errStr = (err.stderr ? err.stderr.toString() : '') + (err.message || '');
      if (errStr.includes('libglib') || errStr.includes('cannot open shared object file') || errStr.includes('error while loading shared libraries')) {
        console.error('\n❌ [check-linux-deps] Missing Electron GUI shared libraries!');
        console.error(`   Details: ${errStr.trim()}`);
        console.error('   Fix by installing required desktop packages:');
        console.error('     Debian/Ubuntu:');
        console.error('       apt-get update && apt-get install -y procps libglib2.0-0 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libgtk-3-0');
        console.error('     Alpine:');
        console.error('       apk add procps glib nss atk cups-libs libxcomposite libxrandr libxscrnsaver alsa-lib gtk+3.0\n');
        hasErrors = true;
      } else if (errStr.includes('Cannot open display') || errStr.includes('The futures of your electron app are cloudy')) {
        if (!process.env.DISPLAY) {
          console.warn('\n⚠️ [check-linux-deps] Headless Linux environment detected without $DISPLAY.');
          console.warn('   If Electron fails to start a window, run using `xvfb-run`:');
          console.warn('     apt-get install -y xvfb && xvfb-run npm run start\n');
        }
      }
    }
  }

  if (hasErrors && process.env.CI) {
    process.exit(1);
  }
}

if (require.main === module) {
  checkLinuxDeps();
}

module.exports = { checkLinuxDeps };
