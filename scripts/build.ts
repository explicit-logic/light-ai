import fs from 'node:fs/promises';
import path from 'node:path';

async function build() {
  await Bun.build({
    entrypoints: ['./src/app.ts'],
    outdir: './out',
    target: 'bun',
    minify: true,
    // sourcemap: 'inline',
  });

  const outPath = path.join(__dirname, '..', 'out');
  await fs.rename(path.join(outPath, 'app.js'), path.join(outPath, 'light-ai.js'));
}

build();
