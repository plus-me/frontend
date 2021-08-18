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

  export class RegisterAction {
    public static readonly type = '[Users] Register';

    public constructor(
      public email: string,
      public password: string,
    ) {}
  }

  export class MarkSeen {
    public static readonly type = '[Users] Get votes of user';

    public constructor(
      public questionId: number,
    ) {}
  }

  export class GetVotes {
    public static readonly type = '[Users] Get votes of user';
  }

  export class ValidateToken {
    public static readonly type = '[Users] Validate Token';
  }

  export class FinishedOnboarding {
    public static readonly type = '[Users] Finished Onboarding';
  }
}
