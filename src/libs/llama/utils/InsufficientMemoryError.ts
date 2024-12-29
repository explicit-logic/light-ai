export class InsufficientMemoryError extends Error {
  public constructor(message = 'Insufficient memory') {
    super(message);
  }
}
