import { spawnSync } from 'child_process';
import path from 'path';

const flags = new Set();
const forwardedArgs = [];
let tagArg;

for (const arg of process.argv.slice(2)) {
  if (arg === '--tag' || arg === '--ci') {
    flags.add(arg);
  } else if (arg.startsWith('--tag=')) {
    flags.add('--tag');
    tagArg = arg.slice('--tag='.length);
  } else {
    forwardedArgs.push(arg);
  }
}

const args = ['test'];

if (flags.has('--tag')) {
  const tag = tagArg || process.env.TAG || process.env.npm_config_tag;
  if (!tag) {
    console.error('Set TAG or pass --tag=<name>, for example: npm run test:tag --tag=smoke');
    process.exit(1);
  }
  args.push('--grep', tag.startsWith('@') ? tag : `@${tag}`);
}

if (flags.has('--ci')) {
  args.push('--workers', process.env.WORKERS || '4');
}

args.push(...forwardedArgs);

const command = path.resolve(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'playwright.cmd' : 'playwright'
);
const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  console.error(result.error.message);
}

process.exit(result.status ?? 1);
