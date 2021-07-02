import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ContactPage } from '../contact/contact';
import { LoginPage } from '../login/login';
import { WelcomePage } from '../welcome/welcome';

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

  msgs: string[];

  constructor(
    private alertCtrl: AlertController,
    private loadCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public storage: Storage,
    public translate: TranslateService,
    public userService: UserServiceProvider)
  {
    // TODO move to translate.instant
    const transKeys = [
      'SIGNUP.OK',
      'SIGNUP.WRONGINPUTS',
      'SIGNUP.CHECKEMAIL',
      'AGB.TITLE',
      'AGB.MESSAGE',
      'PRIVACY.TITLE',
      'PRIVACY.MESSAGE',
    ];
    translate.get(transKeys, {value: 'world'}).subscribe((res: string[]) => this.msgs = res);
  }

  checkInputs(){
    // TODO dont do that, us [isEmail](https://www.npmjs.com/package/isemail)
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|
      // (([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = false; // re.test(this.email);
    return isValidEmail && (this.password.length >= 8) && (this.passwordRepeat === this.password);
  }

  public async signUp() {
    if (!this.checkInputs()) {
      const toast = await this.toastCtrl.create({
        message: this.msgs['SIGNUP.WRONGINPUTS'],
        duration: 3000
      });
      await toast.present();
      return;
    }
    const loading = await this.loadCtrl.create();
    await loading.present();
    const username = this.email.replace(/@.*/i, '');
    this.userService.createNewUser(username, this.email, this.password)
    .subscribe(async () => {
      loading.dismiss();
      const alert = await this.alertCtrl.create({
        message: this.msgs['SIGNUP.CHECKEMAIL'],
        backdropDismiss: false,
        buttons: [ {
            text: this.msgs['SIGNUP.OK'],
            handler: () => {
              this.navCtrl.navigateForward(FrontendRoutes.Login);
            }
        }]
      });

      await alert.present();
    }, async (err) => {
      console.log(err);
      loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: err,
        duration: 3000
      });

      await toast.present();
      this.navCtrl.navigateForward(FrontendRoutes.Contact);
    });
  }

  public async showUsageConditions() {
    const alert = await this.alertCtrl.create({
      header: this.msgs['AGB.TITLE'],
      message: this.msgs['AGB.MESSAGE'],
      buttons: [this.msgs['SIGNUP.OK']]
    });
    await alert.present();
  }

  public async showPrivacy() {
    const alert = await this.alertCtrl.create({
      header: this.msgs['PRIVACY.TITLE'],
      message: this.msgs['PRIVACY.MESSAGE'],
      buttons: [this.msgs['SIGNUP.OK']]
    });
    await alert.present();
  }

  public goToWelcome() {
    this.navCtrl.navigateForward(FrontendRoutes.Welcome);
  }
}
