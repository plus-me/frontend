import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';

import { UserServiceProvider } from '../providers/user-service/user-service';
import { TagsHelper } from '../utils/TagsHelper';
import { WelcomePage } from '../pages/welcome/welcome';
import { Router } from '@angular/router';
import { FrontendRoutes } from '../libs/enums/frontend-routes.enum';
import { Store } from '@ngxs/store';
import { UserActions } from 'src/libs/actions/users.actions';
import { GlobalState } from 'src/libs/interfaces/global.state';

@Component({
  selector: 'app-root',
  providers: [UserServiceProvider],
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = WelcomePage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public translate: TranslateService,
    public userService: UserServiceProvider,
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
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus() {
    this
      .store
      .dispatch(new UserActions.ValidateToken())
      .subscribe(
        (state: GlobalState) => {
          if (state.user.isLoggedIn) {
            this.router.navigate([
              FrontendRoutes.Tabs,
              FrontendRoutes.MainMenu,
            ]);
          } else {
            this.router.navigate([
              FrontendRoutes.Tabs,
              FrontendRoutes.Welcome,
            ]);
          }
        }
      );
  }
}
