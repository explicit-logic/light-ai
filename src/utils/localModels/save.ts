import fs from 'node:fs/promises';
import path from 'node:path';

import { MODELS_DIR } from '@/config/paths';
import type defaultModels from '@/resources/models';
import { writeValue } from '@/utils/localModels/modelsFile';

export function save(model: (typeof defaultModels)[keyof typeof defaultModels]) {
  const [source] = model.sources;

  return async (tempFilePath: string) => {
    const configFilename = `${model.id}.json`;
    const modelFolder = path.join(MODELS_DIR, model.id);
    const modelPath = path.join(modelFolder, configFilename);
    const filePath = path.join(modelFolder, source.filename);
    !(await fs.exists(modelFolder)) && (await fs.mkdir(modelFolder, { recursive: true }));
    await fs.rename(tempFilePath, filePath);
    await fs.writeFile(modelPath, JSON.stringify(model, null, 2));
    await writeValue(model.id, {
      config: path.join(model.id, configFilename),
      model: path.join(model.id, source.filename),
    });
  };
}
