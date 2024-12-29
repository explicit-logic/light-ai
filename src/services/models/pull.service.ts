import { BadRequestError } from '@/exceptions/BadRequestError';

import defaultModels from '@/resources/models';

import { download } from '@/utils/download';
import { hasId } from '@/utils/localModels/modelsFile';
import { save } from '@/utils/localModels/save';

export async function pull(id: keyof typeof defaultModels) {
  const model = defaultModels[id];
  const [source] = model.sources;

  const downloaded = await hasId(model.id);
  if (downloaded) {
    throw new BadRequestError('Model downloaded');
  }

  return await download(source.url, save(model));
}
