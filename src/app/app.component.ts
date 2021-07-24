import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

import { WelcomePage } from '@plusme/pages/welcome/welcome';
import { Router } from '@angular/router';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { TagsActions } from '@plusme/libs/actions/tags.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html',
  styleUrls: ['app.scss'],
})
export class AppComponent {
  rootPage: any = WelcomePage;
  public appPages = [
    {
      title: 'sidebar.randomQuestion',
      url: FrontendRoutes.RandomQuestion,
      class: 'important',
    },
    {
      title: 'sidebar.myQuestions',
      url: FrontendRoutes.MyQuestions,
      class: 'important',
    },
    {
      title: 'sidebar.rejectedQuestions',
      url: FrontendRoutes.MyRejectedQuestions,
      class: 'important',
      lines: 'full',
    },
    {
      title: 'sidebar.privacy',
      url: FrontendRoutes.Privacy,
    },
    {
      title: 'sidebar.imprint',
      url: FrontendRoutes.Imprint,
    },
    {
      title: 'sidebar.licenses',
      url: FrontendRoutes.Licenses,
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
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    await this.storage.create();
    this.statusBar.styleDefault();

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

    this.splashScreen.hide();
  }
}
