import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { PrivacyPage } from '../privacy/privacy.page';
import { TermsPage } from '../terms/terms.page';

@Component({
  selector: 'app-page-signup',
  templateUrl: 'signUp.html'
})
export class SignUpPage {
  password = '';
  email = '';
  passwordRepeat = '';
  inputsValid = false;

  public constructor(
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private store: Store,
    private modalCtrl: ModalController,
  ) { }

  checkInputs(){
    const isValidEmail = this.email.length >= 1;
    return isValidEmail && (this.password.length >= 8) && (this.passwordRepeat === this.password);
  }

  public async signUp() {
    if (!this.checkInputs()) {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('signup.wrongInputs'),
        duration: 3000
      });
      await toast.present();
      return;
    }

    this.store.dispatch(new UserActions.RegisterAction(
      this.email,
      this.password,
    ));
  }

  public async showUsageConditions() {
    const modal = await this.modalCtrl.create({
      component: TermsPage,
      componentProps: {
        isModal: true,
      }
    });

    await modal.present();
  }

  public async showPrivacy() {
    const modal = await this.modalCtrl.create({
      component: PrivacyPage,
      componentProps: {
        isModal: true,
      }
    });

    await modal.present();
  }

  public goToWelcome() {
    this.navCtrl.navigateForward(FrontendRoutes.Welcome);
  }
}
