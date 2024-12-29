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

const shortTarget = {
  'mac-intel': 'bun-darwin-x64',
  'mac-silicon': 'bun-darwin-arm64',
  linux: 'bun-linux-x64-modern',
  win: 'bun-windows-x64-modern',
} as const;

async function compile() {
  const { target: input } = values as { target: keyof typeof shortTarget };

  await buildModels();

  if (input && Object.hasOwn(shortTarget, input)) {
    await rm(path.join(BINARIES_DIR, input), { force: true, recursive: true });
    return compileByPlatform(input, shortTarget[input]);
  }

  await rm(BINARIES_DIR, { force: true, recursive: true });

  for (const [short, target] of Object.entries(shortTarget)) {
    compileByPlatform(short, target);
  }
}

function compileByPlatform(short: string, target: string) {
  Bun.spawn([
    'bun',
    'build',
    '--compile',
    '--minify',
    '--sourcemap',
    `--target=${target}`,
    '--outfile',
    `${BINARIES_DIR}/${short}/light-ai`,
    './src/app.ts',
  ], {
    env: { NODE_ENV: 'production' },
  });
}

compile();
