import { spawn } from 'node:child_process';
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
