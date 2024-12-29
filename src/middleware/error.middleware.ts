import type ElysiaApp from 'elysia';
import type { ErrorResponse } from '../schemas/error';

import { log } from '../utils/logger';

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const useErrorMiddleware = (app: ElysiaApp) => {
  return app.onError(async (context): Promise<ErrorResponse> => {
    const path = context.request.url;
    const error = context?.error;
    const message = isJsonString(context.error.message) ? JSON.parse(context.error.message) : context.error.message;
    const timeStamp = new Date().toISOString();
    const status = (error as { status: number })?.status ?? 500;

    log.error(context, context.error.name);

    return {
      path,
      message,
      timeStamp,
      status,
      code: context.code,
    };
  });
};
