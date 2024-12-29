import Elysia, { t } from 'elysia';

import defaultModels from '@/resources/models';

import { ask } from '@/services/main/ask.service';
import { completion } from '@/services/main/completion.service';

import { parseError } from '@/utils/parseError';

export const main = new Elysia()
  .post(
    '/ask',
    async ({ body, error }) => {
      try {
        const answer = await ask(body);

        return answer;
      } catch (err) {
        return error(...parseError(err));
      }
    },
    {
      body: t.Object({
        model: t.Optional(t.String()),
        prompt: t.String(),
        grammar: t.Optional(t.String()),
        schema: t.Optional(t.Any()),
      }),
      detail: {
        summary: 'Get a quick response',
      },
    },
  )
  .post(
    '/completion',
    async ({ body, error }) => {
      try {
        const result = await completion(body);

        return result;
      } catch (err) {
        return error(...parseError(err));
      }
    },
    {
      body: t.Object({
        model: t.Optional(t.String()),
        prompt: t.String(),
      }),
      detail: {
        summary: 'Text Completion',
      },
    },
  );
