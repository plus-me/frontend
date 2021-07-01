import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from "@ngx-translate/core";
import { Storage } from '@ionic/storage-angular';

import { UserServiceProvider } from "../providers/user-service/user-service";
import { TagsHelper } from "../utils/TagsHelper";
import { TabsPage } from "../pages/tabs/tabs";
import { WelcomePage } from "../pages/welcome/welcome";
import { Router } from '@angular/router';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

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
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('de');
    this.initApp();
  }

  async initApp() {
    await this.platform.ready();
    await this.storage.create();
    this.statusBar.styleDefault();
    this.tagsHelper.loadAllTagObjects();
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus() {
    // Test if user logged in -> Skip login page
    this.userService.loadMe().subscribe(
      me => {
        console.log("Hello: ", me);
        this.router.navigate([FrontendRoutes.Tabs, FrontendRoutes.MainMenu]);
        setTimeout(() => this.splashScreen.hide(), 1000);
      },
      err => {
        console.log("Error logging in: ", err);
        this.router.navigate([FrontendRoutes.Tabs, FrontendRoutes.Welcome]);
        this.splashScreen.hide();
      }
    );
  }
}
