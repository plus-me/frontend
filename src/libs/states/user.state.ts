import { Action, State, StateContext, Store } from '@ngxs/store';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
import { FrontendRoutes } from '../enums/frontend-routes.enum';
import { UserActions } from '../actions/users.actions';
import { plainToClass } from 'class-transformer';
import { UserModel } from '../models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from '@ionic/angular';

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
    private router: Router,
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
        tap(data => {
          ctx.patchState({
            isLoggedIn: true,
            token: data.Token,
          });
          this.store.dispatch(new UserActions.ValidateToken());
          this.router.navigate([
            FrontendRoutes.Tabs,
            FrontendRoutes.RandomQuestion,
          ]);
        }),
        catchError (async (_err) => {
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
                                this.router.navigate([
                                    FrontendRoutes.Tabs,
                                    FrontendRoutes.Login,
                                ]);
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

                        this.router.navigate([
                            FrontendRoutes.Tabs,
                            FrontendRoutes.Contact,
                        ]);
                    }
                ));
    }

  @Action(UserActions.FinishedOnboarding)
  public finishedOnboarding(
    ctx: StateContext<UserStateInterface>,
  ) {
    ctx.patchState({
      hasOnboardingFinished: true,
    });

    this.router.navigate([
      FrontendRoutes.Tabs,
      FrontendRoutes.RandomQuestion,
    ]);
  }
}
