import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html'
})
export class ProfilePage {

  passwordForm: FormGroup;
  password: AbstractControl;
  passwordNew: AbstractControl;

  constructor(
    private store: Store,
    private notifier: TranslatedNotificationController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private fb: FormBuilder,
  ) {
    this.passwordForm = this.fb.group({
      password: ['', Validators.compose([Validators.required])],
      passwordNew: ['', Validators.compose([Validators.required])]
    });

    this.password = this.passwordForm.controls.password;
    this.passwordNew = this.passwordForm.controls.passwordNew;
  }

  logout() {
    this.store.dispatch(UserActions.LogoutAction);
  }

  async deleteAccount() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('profile.deleteConfirmTitle'),
      message: this.translate.instant('profile.deleteConfirmMessage'),
      buttons: [
        {
          text: this.translate.instant('profile.deleteAbortButton'),
          role: 'cancel',
        },
        {
          text: this.translate.instant('profile.deleteConfirmButton'),
          handler: () => {
            this.store.dispatch(new UserActions.DeleteAction());
          }
        }
      ]
    });

    await alert.present();
  }

  updatePassword() {
    if (!this.passwordForm.valid) {
      return;
    }

    this.store.dispatch(new UserActions.UpdatePassword(this.password.value, this.passwordNew.value));
  }
}
