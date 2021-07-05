import { HttpClient } from '@angular/common/http';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { API_ENDPOINT } from 'src/app/app.config';
import {
  catchError,
  tap,
  map,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatedNotificationController } from 'src/utils/TranslatedNotificationController';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';
import { UserActions } from '../actions/users.actions';
import { plainToClass } from 'class-transformer';
import { UserModel } from 'src/models/user.model';


export interface UserStateInterface {
  isLoggedIn: boolean;
  token?: string;
  user?: UserModel;
}

@State<UserStateInterface>({
  name: 'user',
  defaults: {
    isLoggedIn: false,
  }
})
@Injectable()
export class UserState {
  public constructor(
    private http: HttpClient,
    private router: Router,
    private notifier: TranslatedNotificationController,
    private store: Store,
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
          ctx.setState({
            isLoggedIn: true,
            token: data.Token,
          });
          this.store.dispatch(new UserActions.ValidateToken());
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
            user: undefined,
          });

          this.router.navigate([
            FrontendRoutes.Tabs,
            FrontendRoutes.Welcome,
          ]);
        })
      );
  }

  @Action(UserActions.ValidateToken)
  public validateToken(
    ctx: StateContext<UserStateInterface>,
  ) {
    return this
      .http
      .get<unknown>(`${API_ENDPOINT}/Users/me/`)
      .pipe(
        map(data => plainToClass(
          UserModel,
          data,
        )),
        tap((user) => {
          ctx.patchState({
            user,
          });
        }),
        catchError((error: unknown) => {
          ctx.setState({
            isLoggedIn: false,
            user: undefined,
            token: undefined,
          });

          return of(error);
        })
      );
  }
}
