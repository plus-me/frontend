import { Action, State, StateContext, Store } from '@ngxs/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API_ENDPOINT } from '@plusme/app/app.config';
import {
  catchError,
  tap,
  map,
  switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { plainToClass } from 'class-transformer';
import { UserModel } from '@plusme/libs/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from '@ionic/angular';
import { Navigate } from '@ngxs/router-plugin';

export interface UserStateInterface {
  isLoggedIn: boolean;
  token?: string;
  user?: UserModel;
  hasOnboardingFinished: boolean;
}

@State<UserStateInterface>({
  name: 'user',
  defaults: {
    isLoggedIn: false,
    hasOnboardingFinished: false,
  }
})
@Injectable()
export class UserState {
  public constructor(
    private http: HttpClient,
    private notifier: TranslatedNotificationController,
    private store: Store,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
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
        switchMap(data => {
          ctx.patchState({
            isLoggedIn: true,
            token: data.Token,
          });
          return this.store.dispatch(new UserActions.ValidateToken());
        }),
        tap(() => {
          this.store.dispatch(new Navigate([
            FrontendRoutes.RandomQuestion,
          ]));
        }),
        catchError(async (_err) => {
          ctx.patchState({
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
          ctx.patchState({
            isLoggedIn: false,
            token: undefined,
            user: undefined,
          });

          this.store.dispatch(new Navigate([
            FrontendRoutes.Welcome,
          ]));
        })
      );
  }

  @Action(UserActions.FinishedOnboarding)
  public finishedOnboarding(
    ctx: StateContext<UserStateInterface>,
  ) {
      ctx.patchState({
        hasOnboardingFinished: true
      });

      if (ctx.getState().isLoggedIn === true) {
        this.store.dispatch(new Navigate([
          FrontendRoutes.RandomQuestion,
        ]));
      } else {
        this.store.dispatch(new Navigate([
          FrontendRoutes.Welcome,
        ]));
      }
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
          ctx.patchState({
            isLoggedIn: false,
            user: undefined,
            token: undefined,
          });

          return of(error);
        })
      );
  }

  @Action(UserActions.RegisterAction)
  public register(
    _ctx: StateContext<UserStateInterface>,
    action: UserActions.RegisterAction,
  ) {
    return this
      .http
      .post<any>(
        API_ENDPOINT + '/Users/',
        JSON.stringify({
          email: action.email,
          password: action.password,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .pipe(
        tap(async () => {
          const alert = await this.alertCtrl.create({
            message: this.translate.instant('SIGNUP.CHECKEMAIL'),
            backdropDismiss: false,
            buttons: [{
              text: this.translate.instant('SIGNUP.OK'),
              handler: () => {
                this.store.dispatch(new Navigate([
                  FrontendRoutes.Login,
                ]));
              }
            }]
          });

          await alert.present();
        }),
        catchError(async (error: Error | HttpErrorResponse) => {
          const message = (error instanceof HttpErrorResponse ?
            error.error.message :
            error.message);

          const toast = await this.toastCtrl.create({
            message,
            duration: 3000
          });

          await toast.present();

          this.store.dispatch(new Navigate([
            FrontendRoutes.Contact,
          ]));
        }),
      );
  }
}
