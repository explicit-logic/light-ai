import { parseArgs } from 'node:util';
import { rm } from 'node:fs/promises';
import path from 'node:path';

import { buildModels } from './buildModels';

const BINARIES_DIR = './resources/bin';

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    target: {
      type: 'string',
      short: 't',
    }
  },
  strict: true,
  allowPositionals: true,
});

const APP_NAME = 'light-ai';

const targetFilename = {
  'bun-darwin-x64': `${APP_NAME}-x86_64-apple-darwin`,
  'bun-darwin-arm64': `${APP_NAME}-aarch64-apple-darwin`,
  'bun-linux-x64-modern': `${APP_NAME}-x86_64-unknown-linux-gnu`,
  'bun-windows-x64-modern': `${APP_NAME}-x86_64-pc-windows-msvc.exe`,
} as const;

async function compile() {
  const { target: input } = values as { target: keyof typeof targetFilename };

  await buildModels();

  await rm(BINARIES_DIR, { force: true, recursive: true });

  if (input && Object.hasOwn(targetFilename, input)) {
    return compileByPlatform(input, targetFilename[input]);
  }

  for (const [target, filename] of Object.entries(targetFilename)) {
    compileByPlatform(target as keyof typeof targetFilename, filename);
  }
}

function compileByPlatform(target: keyof typeof targetFilename, filename: typeof targetFilename[keyof typeof targetFilename]) {
  Bun.spawn([
    'bun',
    'build',
    '--compile',
    '--minify',
    '--sourcemap',
    `--target=${target}`,
    '--outfile',
    path.join(BINARIES_DIR, filename),
    './src/app.ts',
  ], {
    env: { NODE_ENV: 'production' },
  });
}

compile();
