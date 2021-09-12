import { Injectable } from '@angular/core';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Device } from '@ionic-native/device/ngx';
import '@havesource/cordova-plugin-push/types';
import { UserActions } from '../actions/users.actions';
import { Store } from '@ngxs/store';

@Injectable()
export class PushService {
  private pushManager?: PhonegapPluginPush.PushNotification;

  public constructor(
    private uniqueDeviceID: UniqueDeviceID,
    private device: Device,
    private store: Store,
  ) { }

  public async setupPushNotifications() {
    const hasPermission = await (new Promise<boolean>((resolve, reject) => {
      PushNotification.hasPermission((data) => resolve(data.isEnabled), () => reject(false));
    }));

    if (!hasPermission) {
      return;
    }

    this.pushManager = PushNotification.init({});

    this.pushManager.on('registration', async (response) => {
      const action = new UserActions.RegisterDeviceForNotification(
        response.registrationId,
        await this.uniqueDeviceID.get(),
        this.device.platform.toLowerCase(),
      );

      this.store.dispatch(action);
    });
  }
}
