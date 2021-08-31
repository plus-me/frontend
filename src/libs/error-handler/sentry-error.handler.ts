import { ErrorHandler } from '@angular/core';

import * as Sentry from 'sentry-cordova';

export class SentryIonicErrorHandler extends ErrorHandler {
  public handleError(error: any) {
    super.handleError(error);
    try {
      Sentry.captureException(error.originalError || error);
    } catch (e) {
      console.error(e);
    }
  }
}
