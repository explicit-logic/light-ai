export class BadRequestError extends Error {
  readonly status: number = 400;
  readonly code: string = 'BAD_REQUEST';
}
