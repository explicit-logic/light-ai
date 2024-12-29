import defaultModels from '@/resources/models';

import { log } from '@/utils/logger';

import { download } from '@/utils/download';
import { hasId } from '@/utils/localModels/modelsFile';
import { save } from '@/utils/localModels/save';

export async function pullModel(id?: string) {
  try {
    if (!id) return;
    if (!Object.hasOwn(defaultModels, id)) {
      return log.error('Unknown model name');
    }

    const model = defaultModels[id as keyof typeof defaultModels];
    const [source] = model.sources;

    const downloaded = await hasId(model.id);
    if (downloaded) {
      return log.warn('Model downloaded');
    }

    const { start } = await download(source.url, save(model));

    await start();
  } catch (error) {
    log.error(error);
  }
}
