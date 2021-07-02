import { HttpClient } from '@angular/common/http';
import { Action, State, StateContext } from '@ngxs/store';
import {Storage} from '@ionic/storage';
import { API_ENDPOINT } from 'src/app/app.config';
import {
  catchError,
  tap,
} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatedNotificationController } from 'src/utils/TranslatedNotificationController';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';
import { UserActions } from '../actions/users.actions';


export interface UserStateInterface {
  isLoggedIn: boolean;
  token?: string;
}

@State<UserStateInterface>({
  name: 'user',
  defaults: {
    isLoggedIn: false,
  }
})
@Injectable()
export class UserState {
  public static readonly tokenKey = 'localUserToken';
  public static readonly emailKey = 'localUserEmail';

  public constructor(
    private storage: Storage,
    private http: HttpClient,
    private router: Router,
    private notifier: TranslatedNotificationController,
  ) { }

  @Action(UserActions.LoginAction)
  public login(
    ctx: StateContext<UserStateInterface>,
    action: UserActions.LoginAction,
  ) {
    return this
      .http
      .post<any>(
        API_ENDPOINT + '/Users/token/',
        {
          email: action.email,
          password: action.password,
        },
      )
      .pipe(
        tap(data => {
          console.dir(data);
          ctx.setState({
            isLoggedIn: true,
            token: data.Token,
          });
          this.storage.set(UserState.tokenKey, data.Token);
          this.storage.set(UserState.emailKey, action.email);
          this.router.navigate([
            FrontendRoutes.Tabs,
            FrontendRoutes.MainMenu,
          ]);
        }),
        catchError (async (_err) => {
          ctx.setState({
            isLoggedIn: false,
            token: undefined,
          });

          this.notifier.showToast('LOGIN.FAILED');
        }),
    );
  }

  @Action(UserActions.LogoutAction)
  public logout(
    ctx: StateContext<UserStateInterface>,
  ) {
    return this
      .http
      .post<any>(
        API_ENDPOINT + '/Users/logout',
        {}
      )
      .pipe(
        tap(() => {
          ctx.setState({
            isLoggedIn: false,
            token: undefined,
          });
          this.storage.remove(UserState.tokenKey);
          this.storage.remove(UserState.emailKey);

          this.router.navigate([
            FrontendRoutes.Tabs,
            FrontendRoutes.Welcome,
          ]);
        })
      );
  }
}
