import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { useErrorMiddleware } from '@/middleware/error.middleware';
import { getModuleVersion } from '@/utils/getModuleVersion';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import chalk from 'chalk';
import Elysia from 'elysia';

import { boot } from '@/boot/boot';

import { main } from '@/controllers/main.controller';
import { models } from '@/controllers/model.controller';

if (Bun.env.NODE_ENV === 'development') {
  Bun.spawn(['bun', './scripts/watch.ts']);
}

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    port: {
      type: 'string',
      short: 'p',
    },
    model: {
      type: 'string',
      short: 'm',
    },
  },
  strict: true,
  allowPositionals: true,
});

export type Params = Partial<typeof values>;

const api = new Elysia<'/v1'>({
  prefix: '/v1',
})
  .use(models)
  .use(main);

export const app = new Elysia({
  serve: {
    hostname: process.env.HOST,
    idleTimeout: 255,
  },
})
  .use(cors({ origin: true }))
  .use(useErrorMiddleware)
  .use(swagger())
  .get('/', () => ({ status: 'ok' }))
  .use(api);

async function start(params: Params = {}) {
  const { port } = params;
  await boot(params);

  app.listen(port || process.env.PORT);
  console.log(`Light AI ${getModuleVersion()}\n`);

  const url = `http://${app.server?.hostname}:${app.server?.port}`;

  console.log(`Running:\n ${chalk.bold.underline(url)}\n`);
  console.log(`Swagger:\n ${chalk.bold.underline(`${url}/swagger`)}`);
}

const FILE = fileURLToPath(import.meta.url);
const isCLI = FILE === Bun.argv[1];

if (isCLI) {
  start(values);
}
