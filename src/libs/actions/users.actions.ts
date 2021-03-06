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

  export class DeleteAction {
    public static readonly type = '[Users] Delete user profile';
  }

  export class RegisterAction {
    public static readonly type = '[Users] Register';

    public constructor(
      public email: string,
      public password: string,
    ) {}
  }

  export class UpdatePassword {
    public static readonly type = '[Users] Set a new password';

    public constructor(
      public password: string,
      public new_password: string,
    ) {}
  }

  export class ResetPassword {
    public static readonly type = '[Users] Request a password reset link';

    public constructor(
      public email: string,
    ) {}
  }

  export class MarkSeen {
    public static readonly type = '[Users] Mark answer as seen';

    public constructor(
      public answerId: number,
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

  export class SetNotificationPreference {
    public static readonly type = '[Users] Set User Preference for Notifications';

    public constructor(
      public hasNotificationsConsented: boolean,
    ) {}
  }

  export class RegisterDeviceForNotification {
    public static readonly type = '[Users] Register User\'s Device';

    public constructor(
      public registrationToken: string,
      public deviceId: string,
      public osType: string,
    ) {}
  }
}
