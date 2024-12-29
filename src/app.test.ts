import { describe, expect, it } from 'bun:test';
import { app } from './app';

const HOST = process.env.HOST;
const PORT = process.env.PORT;

const BASE_URL = `http://${HOST}:${PORT}`;

describe('Server', () => {
  it('returns a status', async () => {
    const response = await app.handle(new Request(BASE_URL)).then((res) => res.json());
    expect(response).toContainValue('ok');
  });

  it('return an array of models', async () => {
    const response = await app.handle(new Request(`${BASE_URL}/v1/models`)).then((res) => res.json());

    expect(response).toBeArray();
  });
});
