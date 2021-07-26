export class UnknownError extends Error {
  public constructor(
    public reason: unknown,
  ) {
    super();
  }
}
