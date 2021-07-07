import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { FrontendRoutes } from '../../libs/enums/frontend-routes.enum';
import { ContactPage } from '../contact/contact';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';
import { Store } from '@ngxs/store';
import { UserActions } from 'src/libs/actions/users.actions';

@Component({
  selector: 'app-page-signup',
  templateUrl: 'signUp.html'
})
export class SignUpPage {
  password;
  email;
  passwordRepeat;
  sex; //m/w
  birthYear; //YYYY
  plz; //2 numbers
  inputsValid = false;

  contactView = ContactPage;
  loginView = LoginPage;
  welcomeView = WelcomePage;

  public constructor(
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private translate: TranslateService,
    private store: Store,
  ) { }

  checkInputs(){
    const isValidEmail = this.email.length >= 1;
    return isValidEmail && (this.password.length >= 8) && (this.passwordRepeat === this.password);
  }

  public async signUp() {
    if (!this.checkInputs()) {
      const toast = await this.toastCtrl.create({
        message: this.translate.instant('SIGNUP.WRONGINPUTS'),
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
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('AGB.TITLE'),
      message: this.translate.instant('AGB.MESSAGE'),
      buttons: [this.translate.instant('SIGNUP.OK')]
    });
    await alert.present();
  }

  public async showPrivacy() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('PRIVACY.TITLE'),
      message: this.translate.instant('PRIVACY.MESSAGE'),
      buttons: [this.translate.instant('SIGNUP.OK')]
    });
    await alert.present();
  }

  public goToWelcome() {
    this.navCtrl.navigateForward(FrontendRoutes.Welcome);
  }
}
