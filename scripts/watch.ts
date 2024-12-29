import { argv } from 'node:process'
import { fileURLToPath } from 'node:url'

import { watch } from 'node:fs';
import { buildModels, modelsDir } from './buildModels';

const FILE = fileURLToPath(import.meta.url)
const isCLI = FILE === argv[1]

if (isCLI) {
  watch(modelsDir, buildModels);
}
