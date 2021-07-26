export class UnknownHttpError extends Error {
  public constructor(
    public reason: unknown,
  ) {
    super();
  }
}
