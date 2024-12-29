type ApiError = {
  status: number;
  code: string;
  message: string;
};

export function parseError(_error: unknown): [number, ApiError] {
  const error = typeof _error === 'object' ? _error : { message: _error };
  const status = (error as { status: number })?.status || 500;
  const code = (error as { code: string })?.code || 'INTERNAL_SERVER_ERROR';
  const message = (error as { message: string })?.message || 'Internal Server Error';

  return [status, { status, code, message }];
}
