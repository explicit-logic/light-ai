import fs from 'node:fs/promises';

import { MODELS_FILE } from '@/config/paths';

type Value = {
  config: string;
  model: string;
};

export async function read() {
  const exists = await fs.exists(MODELS_FILE);

  if (exists) {
    try {
      const raw = await fs.readFile(MODELS_FILE, 'utf-8');
      const data = JSON.parse(raw) as Record<string, Value>;

      return data;
    } catch {}
  }

  return {};
}

export async function hasId(modelId: string) {
  const models = await read();

  return Boolean(models[modelId]);
}

export async function getValue(modelId: string) {
  const models = await read();

  return models[modelId];
}

export async function writeValue(modelId: string, value: Value) {
  const models = await read();
  models[modelId] = value;
  await fs.writeFile(MODELS_FILE, JSON.stringify(models, null, 2));
}
