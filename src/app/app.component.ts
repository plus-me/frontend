import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';


import { TagsHelper } from '@plusme/utils/TagsHelper';
import { WelcomePage } from '@plusme/pages/welcome/welcome';
import { Router } from '@angular/router';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { Store } from '@ngxs/store';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { GlobalState } from '@plusme/libs/interfaces/global.state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = WelcomePage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public tagsHelper: TagsHelper,
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
        FrontendRoutes.Tabs,
        FrontendRoutes.RandomQuestion,
      ]);
    } else {
      this.router.navigate([
        FrontendRoutes.Tabs,
        FrontendRoutes.Onboarding,
      ]);
    }

    this.splashScreen.hide();
  }
}
