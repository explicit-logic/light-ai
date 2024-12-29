import { argv } from 'node:process';
import { fileURLToPath } from 'node:url';
import { readdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

export const modelsDir = path.resolve(import.meta.dirname, '..', 'resources', 'models');

export async function buildModels() {
  const outputFile = path.resolve(import.meta.dirname, '../src/resources/models.ts');
  const paths: Record<string, unknown> = {};
  const files = await readdir(modelsDir);

  for (const file of files) {
    const ext = path.extname(file);
    if (ext !== '.json') continue;
    const filePath = path.resolve(modelsDir, file);
    const raw = await readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as { id: string };
    paths[data.id] = data;
  }

  const content = `export default ${JSON.stringify(paths, null, 2)};\n`;

  await writeFile(outputFile, content);
}

const FILE = fileURLToPath(import.meta.url);
const isCLI = FILE === argv[1];

if (isCLI) {
  buildModels();
}
