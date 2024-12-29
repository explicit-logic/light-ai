import { pull } from '@/services/models/pull.service';
import { getAll } from '@/storages/builtin.storage';
import Elysia, { t, NotFoundError } from 'elysia';

import { parseError } from '@/utils/parseError';

import defaultModels from '@/resources/models';

export const models = new Elysia<'/models'>({
  prefix: '/models',
})
  .get(
    '/',
    async () => {
      const models = await getAll();

      return models;
    },
    {
      detail: {
        summary: 'List of models',
      },
    },
  )
  .post(
    '/pull',
    async function* ({ body, error }) {
      try {
        const { model } = body;
        const { getProgress } = await pull(model);
        for await (const progress of getProgress()) {
          yield progress;
        }
      } catch (err) {
        return error(...parseError(err));
      }
    },
    {
      body: t.Required(
        t.Object({
          model: t.Union(Object.keys(defaultModels).map((value) => t.Literal(value))),
        }),
      ),
      detail: {
        summary: 'Pull a model',
      },
    },
  );
