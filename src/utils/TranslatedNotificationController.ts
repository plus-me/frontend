import { Injectable} from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class TranslatedNotificationController {

  public constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
  ) {}

  public async showToast(text: string, showDuration: number=3000) {
    const toast = await this.toastCtrl.create({
      message: this.translate.instant(text),
      duration: showDuration,
    });

    await toast.present();
  }

  public async showAlert(
    title: string,
    message: string,
    button: string,
  ) {
    const alert = await this
      .alertCtrl
      .create(
        {
          header: this.translate.instant(title),
          message: this.translate.instant(message),
          buttons: [this.translate.instant(button)],
        },
      );

    await alert.present();
  }

}
