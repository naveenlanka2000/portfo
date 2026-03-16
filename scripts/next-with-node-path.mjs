import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const projectRoot = path.resolve(scriptDir, '..');

const nextBin = path.join(projectRoot, 'node_modules', 'next', 'dist', 'bin', 'next');

const nextArgs = process.argv.slice(2);
if (nextArgs.length === 0) {
  // eslint-disable-next-line no-console
  console.error('Usage: node scripts/next-with-node-path.mjs <dev|build|start> [...args]');
  process.exit(1);
}

function ensureTempLinkedDir(linkPath, targetPath) {
  try {
    fs.mkdirSync(targetPath, { recursive: true });

    if (fs.existsSync(linkPath)) {
      const st = fs.lstatSync(linkPath);
      if (st.isSymbolicLink()) return;
      fs.rmSync(linkPath, { recursive: true, force: true });
    }

    const type = process.platform === 'win32' ? 'junction' : 'dir';
    fs.symlinkSync(targetPath, linkPath, type);
  } catch {
    // If this fails, Next will fall back to the normal folder.
  }
}

// On Windows/OneDrive, Next dev can fail with EPERM writing trace/cache.
// `next.config.mjs` uses distDir `.next-dev`; we junction it to TEMP.
if (nextArgs[0] === 'dev') {
  ensureTempLinkedDir(path.join(projectRoot, '.next-dev'), path.join(os.tmpdir(), 'portfo-next-dev'));
}

const env = {
  ...process.env,
  NODE_PATH: path.join(projectRoot, 'node_modules'),
};

const child = spawn(process.execPath, [nextBin, ...nextArgs], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 1);
});
