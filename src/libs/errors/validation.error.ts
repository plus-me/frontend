export class ValidationError extends Error {
  public constructor(
    public reasons: { [index: string]: string[]  }
  ) {
    super();
  }
}
