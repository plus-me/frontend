import { Component } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

import { WelcomePage } from '@plusme/pages/welcome/welcome';
import { Router } from '@angular/router';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { Select, Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Observable } from 'rxjs';
import { CreateQuestionComponent } from '@plusme/components/create-question/create-question.component';
import { TagsActions } from '@plusme/libs/actions/tags.actions';
import { PackageJson } from 'type-fest';
import { PushService } from '@plusme/libs/services/push.service';

const packageJSON = require('../../package.json') as PackageJson;

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
})
export class AppComponent {
  @Select((state: GlobalState) => state.user.isLoggedIn)
  public isLoggedIn: Observable<boolean>;

  @Select((state: GlobalState) => state.user.hasOnboardingFinished)
  public hasOnboardingFinished: Observable<boolean>;

  public readonly version = packageJSON.version;

  rootPage: any = WelcomePage;
  public appPages = [
    {
      title: 'sidebar.randomQuestion',
      url: FrontendRoutes.RandomQuestion,
      class: 'important',
      lines: 'none',
    },
    {
      title: 'sidebar.myQuestions',
      url: FrontendRoutes.MyQuestions,
      class: 'important',
      lines: 'none',
    },
    {
      title: 'sidebar.inbox',
      url: FrontendRoutes.Inbox,
      class: 'important',
      lines: 'full',
    },
    {
      title: 'sidebar.terms',
      url: FrontendRoutes.Terms,
    },
    {
      title: 'sidebar.privacy',
      url: FrontendRoutes.Privacy,
    },
    {
      title: 'sidebar.imprint',
      url: FrontendRoutes.Imprint,
    },
    /*{
      title: 'sidebar.licenses',
      url: FrontendRoutes.Licenses,
    },*/
    {
      title: 'sidebar.contact',
      url: FrontendRoutes.Contact,
    },
  ];

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    private storage: Storage,
    private router: Router,
    private store: Store,
    private modalCtrl: ModalController,
    private pushService: PushService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    await this.storage.create();
    this.statusBar.styleDefault();

    const isElectionOver = this.store.selectSnapshot((state: GlobalState) => state.user.isElectionOver);

    if (isElectionOver) {
      this.store.dispatch(new UserActions.LogoutAction());

      this.router.navigate([
        FrontendRoutes.ElectionOver,
      ]);

      this.splashScreen.hide();

      return;
    }

    this.store.dispatch(new TagsActions.RefreshTags());

    const hasOnboardingFinished = this
      .store
      .selectSnapshot(
        (state: GlobalState) => state.user.hasOnboardingFinished
      );

    if (hasOnboardingFinished) {
      this
        .store
        .dispatch(new UserActions.ValidateToken());

      this.router.navigate([
        FrontendRoutes.RandomQuestion,
      ]);
    } else {
      this.router.navigate([
        FrontendRoutes.Onboarding,
      ]);
    }

    const hasNotificationsConsented = this.store.selectSnapshot((store: GlobalState) => store.user.hasConsentedNotifications);

    if (hasNotificationsConsented === true) {
      await this.pushService.setupPushNotifications();
    }

    this.splashScreen.hide();
  }

  public async showCreateQuestionModal() {
    const modal = await this.modalCtrl.create({
      component: CreateQuestionComponent,
    });

    await modal.present();
  }
}
