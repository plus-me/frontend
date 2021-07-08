import { Component } from '@angular/core';
import { SignUpPage } from '../signUp/signUp';
import { LoginPage } from '../login/login';
import { FrontendRoutes } from '../../libs/enums/frontend-routes.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  signUpView = SignUpPage;
  loginView = LoginPage;

  public constructor(
    private router: Router,
  ) {}

  public goToSignup() {
    this.router.navigate([FrontendRoutes.Tabs, FrontendRoutes.SignUp]);
  }

  public goToLogin() {
    this.router.navigate([FrontendRoutes.Tabs, FrontendRoutes.Login]);
  }

}
