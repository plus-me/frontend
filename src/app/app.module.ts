import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AppComponent } from './app.component';
import { QuestionBubbleComponent } from '@plusme/components/question-bubble/question-bubble';

import { ContactPage } from '@plusme/pages/contact/contact.page';
import { FaqPage } from '@plusme/pages/faq/faq';
import { LoginPage } from '@plusme/pages/login/login';
import { RandomQuestionsPage } from '@plusme/pages/randomQuestions/randomQuestions';
import { SignUpPage } from '@plusme/pages/signUp/signUp';
import { WelcomePage } from '@plusme/pages/welcome/welcome';

import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { AppRoutes } from './app-routing';
import { AppInterceptor } from '@plusme/libs/interceptors/app.interceptor';
import { Drivers } from '@ionic/storage';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@plusme/libs/states/user.state';
import { TagState } from '@plusme/libs/states/tag.state';
import { OnboardingComponent } from '@plusme/pages/onboarding/onboarding.component';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NavbarComponent } from '@plusme/components/navbar/navbar.component';
import { ImprintPage } from '@plusme/pages/imprint/imprint.page';
import { PrivacyPage } from '@plusme/pages/privacy/privacy.page';
import { TermsPage } from '@plusme/pages/terms/terms.page';
import { CreateQuestionComponent } from '@plusme/components/create-question/create-question.component';
import { QuestionState } from '@plusme/libs/states/question.state';
import { AnswerState } from '@plusme/libs/states/answer.state';
import { QuestionListItemComponent } from '@plusme/components/question-list-item/question-list-item';
import { MyQuestionsListComponent } from '@plusme/components/my-questions-list/my-questions-list.component';
import { AllAnsweredListComponent } from '@plusme/components/all-answered-list/all-answered-list.component';
import { InboxPage } from '@plusme/pages/inbox/inbox';
import { MyQuestionsPage } from '@plusme/pages/myQuestions/myQuestions';
import { ProfilePage } from '@plusme/pages/profile/profile.page';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';
import { AnswersPage } from '@plusme/pages/answers/answers';
import { ReportQuestionPage } from '@plusme/pages/report/report';
import { SortMenuComponent } from '@plusme/components/navbar/sort.component';

import * as Sentry from 'sentry-cordova';
import { SentryIonicErrorHandler } from '@plusme/libs/error-handler/sentry-error.handler';
import { MyDownVotedQuestionsPage } from '@plusme/pages/myDownvotes/myDownvotes';
import { ShowHidePasswordComponent } from '@plusme/components/show-hide-password/show-hide-password.component';
import { QuestionListItemMetaComponent } from '@plusme/components/question-list-item-meta/question-list-item-meta';
import { HighlightPipe } from '@plusme/utils/hilight.pipe';
import { PushService } from '@plusme/libs/services/push.service';
import { ElectionOverPage } from '@plusme/pages/election-over/election-over.page';

Sentry.init({
  dsn: 'https://d55dfb169cbd4aedabc1c9e3b5e82302@sentry.datenknoten.me/3',
  release: `plusme-app@v${require('../../package.json').version}`,
});

const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, './assets/lang/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    QuestionBubbleComponent,
    ContactPage,
    FaqPage,
    LoginPage,
    RandomQuestionsPage,
    QuestionListItemComponent,
    QuestionListItemMetaComponent,
    InboxPage,
    SignUpPage,
    WelcomePage,
    OnboardingComponent,
    NavbarComponent,
    ImprintPage,
    PrivacyPage,
    TermsPage,
    ProfilePage,
    MyQuestionsPage,
    AnswersPage,
    CreateQuestionComponent,
    MyQuestionsListComponent,
    AllAnsweredListComponent,
    SearchQuestionsPage,
    ReportQuestionPage,
    MyDownVotedQuestionsPage,
    ShowHidePasswordComponent,
    HighlightPipe,
    SortMenuComponent,
    ElectionOverPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot({
      backButtonText: '',
      scrollPadding: false,
      scrollAssist: false,
    }),
    IonicStorageModule.forRoot({
      driverOrder: [Drivers.IndexedDB],
      dbKey: 'plusme',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
    }),
    RouterModule.forRoot(
      AppRoutes,
      {
        useHash: true,
      }
    ),
    NgxsModule.forRoot(
      [
        UserState,
        TagState,
        QuestionState,
        AnswerState,
      ],
      {
        developmentMode: false,
      },
    ),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({
      key: [
        UserState,
      ]
    }),
    NgxsRouterPluginModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    ContactPage,
    FaqPage,
    LoginPage,
    RandomQuestionsPage,
    InboxPage,
    SignUpPage,
    WelcomePage,
    OnboardingComponent,
    ImprintPage,
    PrivacyPage,
    TermsPage,
    ProfilePage,
    MyQuestionsPage,
    AnswersPage,
    CreateQuestionComponent,
    MyQuestionsListComponent,
    AllAnsweredListComponent,
    SearchQuestionsPage,
    ReportQuestionPage,
    MyDownVotedQuestionsPage,
    SortMenuComponent,
    ElectionOverPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslatedNotificationController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (store: Store) => new AppInterceptor(store),
      multi: true,
      deps: [Store],
    },
    {provide: ErrorHandler, useClass: SentryIonicErrorHandler},
    Device,
    UniqueDeviceID,
    PushService,
  ]
})
export class AppModule {
}
