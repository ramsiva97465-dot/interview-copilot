#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const version = (process.env.NATIVELY_RELEASE_VERSION || pkg.version || '').replace(/^v/, '');
const tag = `v${version}`;

const installerName = `MeetFloo-Setup-${version}.exe`;
const installerPath = path.join(repoRoot, 'release', installerName);

if (!fs.existsSync(installerPath)) {
  console.error(`[upload-github-release] Installer not found at: ${installerPath}`);
  console.error(`[upload-github-release] Run 'npm run package:win' first.`);
  process.exit(1);
}

const stats = fs.statSync(installerPath);
console.log(`[upload-github-release] Found ${installerName} (${(stats.size / 1024 / 1024).toFixed(1)} MB)`);
console.log(`[upload-github-release] Uploading to GitHub Release tag: ${tag}...`);

// Determine gh executable path
let ghBin = 'gh';
const defaultWinPath = 'C:\\Program Files\\GitHub CLI\\gh.exe';
if (process.platform === 'win32' && fs.existsSync(defaultWinPath)) {
  ghBin = defaultWinPath;
}

try {
  execFileSync(ghBin, ['release', 'upload', tag, installerPath, '--clobber'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  console.log(`\n🎉 [upload-github-release] Successfully uploaded ${installerName} to ${tag}!`);
} catch (err) {
  console.error(`\n❌ [upload-github-release] Upload failed:`, err.message);
  process.exit(1);
}
