import path from 'node:path';

import { MODELS_DIR } from '@/config/paths';
import { read as readModelsFile } from './modelsFile';

export async function ensureModelPath(id?: string) {
  const value = await ensureValue(id);
  if (!value) {
    throw new Error('Not a single model was downloaded');
  }

  return path.join(MODELS_DIR, value.model);
}

async function ensureValue(id?: string) {
  const modelsFile = await readModelsFile();
  if (!id) {
    const [value] = Object.values(modelsFile);

    return value;
  }

  return modelsFile[id];
}
