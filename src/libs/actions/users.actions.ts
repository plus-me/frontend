export namespace UserActions {
  export class LoginAction {
    public static readonly type = '[Users] Login';

    public constructor(
      public email: string,
      public password: string,
    ) {}
  }

  export class LogoutAction {
    public static readonly type = '[Users] Logout';

  }

  export class ValidateToken {
    public static readonly type = '[Users] Validate Token';
  }
}
