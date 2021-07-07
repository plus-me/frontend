import { Component, ViewChild } from '@angular/core';
import { AlertController, NavController, IonTabs } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FrontendRoutes } from '../../libs/enums/frontend-routes.enum';
import { UserActions } from 'src/libs/actions/users.actions';
import { GlobalState } from 'src/libs/interfaces/global.state';

import { UserServiceProvider } from '../../providers/user-service/user-service';

import { ContactPage } from '../contact/contact';
import { FaqPage } from '../faq/faq';

@Component({
  templateUrl: './tabs.html',
  styleUrls: ['./tabs.scss'],
})
export class TabsPage {
  @Select((state: GlobalState) => state.user.isLoggedIn)
  public isLoggedIn: Observable<boolean>;

  @ViewChild(IonTabs)
  public tabs: IonTabs;

  public tab1Root = FrontendRoutes.RandomQuestion;
  public tab2Root = FrontendRoutes.MainMenu;
  public tab3Root = FrontendRoutes.SearchQuestions;
  public contactPage = ContactPage;
  public faqPage = FaqPage;
  public onboardingVisible = false;

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    public userService: UserServiceProvider,
    private translate: TranslateService,
    private store: Store,
  ) {}

  ionViewWillEnter() {
    this.storage.get('showedOnboarding').then(val => { if (!val) {this.showOnboarding();} });
  }

  logout() {
    this.store.dispatch(new UserActions.LogoutAction());
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

  showImprint() {
    window.open('https://wepublic.me/impressum.html', '_blank', 'location=yes');
  }

  showOnboarding() {
    console.log('Show onboarding');
    // TODO
    //this.tabs.setElementClass('blurred', true);
    this.onboardingVisible = true;
  }

  hideOnboarding() {
    console.log('Hide onboarding');
    // TODO
    // this.tabs.setElementClass('blurred', false);
    this.onboardingVisible = false;
    this.storage.set('showedOnboarding', true);
  }

  public goToContact() {
    this.navCtrl.navigateForward(FrontendRoutes.Contact);
  }

  public goToFaq() {
    this.navCtrl.navigateForward(FrontendRoutes.FAQ);
  }
}
