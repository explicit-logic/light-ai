export class UnsupportedError extends Error {
  /** @internal */
  public constructor(message = 'UnsupportedError') {
    super(message);
  }
}
