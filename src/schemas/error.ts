import ElysiaApp, { error, type Static, t } from 'elysia';

export const ErrorResponseSchema = t.Object({
  path: t.String(),
  timeStamp: t.String(),
  status: t.Number(),
  code: t.String(),
  message: t.String(),
});

export type ErrorResponse = Static<typeof ErrorResponseSchema>;
