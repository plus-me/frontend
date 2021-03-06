import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device/ngx';
import * as Sentry from 'sentry-cordova';

import { UserActions } from '../actions/users.actions';
import { Store } from '@ngxs/store';
import { GlobalState } from '../interfaces/global.state';
import { Router } from '@angular/router';
import { FrontendRoutes } from '../enums/frontend-routes.enum';

@Injectable()
export class PushService {
  public constructor(
    private uniqueDeviceID: UniqueDeviceID,
    private device: Device,
    private store: Store,
    private router: Router,
  ) { }

  public async setupPushNotifications() {
    const isLoggedIn = this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn);

    if(!isLoggedIn) {
      return;
    }

    const hasConsented = this.store.selectSnapshot((state: GlobalState) => state.user.hasConsentedNotifications);

    if (!hasConsented) {
      return;
    }

    try {
      await cordova.plugins.firebase.messaging.requestPermission();
    } catch(error) {
      return;
    }

    const token = await cordova.plugins.firebase.messaging.getToken();

    const action = new UserActions.RegisterDeviceForNotification(
      token,
      await this.uniqueDeviceID.get(),
      this.device.platform.toLowerCase(),
    );

    this.registerBackgroundListener();

    this.store.dispatch(action);
  }

  public registerBackgroundListener() {
    cordova.plugins.firebase.messaging.subscribe('plusme');

    cordova.plugins.firebase.messaging.onBackgroundMessage(async (payload) => {
      this.router.navigate([
        FrontendRoutes.Inbox,
      ]);

      Sentry.captureMessage('Recieved a push message!', {
        extra: payload as any,
      });
    });

    cordova.plugins.firebase.messaging.onMessage(async (payload) => {
      this.router.navigate([
        FrontendRoutes.Inbox,
      ], {
        queryParams: {
          mode: 'all',
        }
      });

      Sentry.captureMessage('Recieved a push message!', {
        extra: payload as any,
      });
    });
  }
}
