import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {RouteReuseStrategy, RouterModule} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {IonicStorageModule} from '@ionic/storage-angular';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsStoragePluginModule} from '@ngxs/storage-plugin';
import {AppComponent} from './app.component';
import {AnswerBubbleComponent} from '@plusme/components/answer-bubble/answer-bubble';
import {QuestionBubbleComponent} from '@plusme/components/question-bubble/question-bubble';

import {ContactPage} from '@plusme/pages/contact/contact';
import {FaqPage} from '@plusme/pages/faq/faq';
import {LoginPage} from '@plusme/pages/login/login';
import {RandomQuestionsPage} from '@plusme/pages/randomQuestions/randomQuestions';
import {SignUpPage} from '@plusme/pages/signUp/signUp';
import {WelcomePage} from '@plusme/pages/welcome/welcome';

import {NewsServiceProvider} from '@plusme/providers/news-service/news-service';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import {UserServiceProvider} from '@plusme/providers/user-service/user-service';
import {TranslatedNotificationController} from '@plusme/utils/TranslatedNotificationController';
import {AppRoutes} from './app-routing';
import {AppInterceptor} from '@plusme/libs/interceptors/app.interceptor';
import {Drivers} from '@ionic/storage';
import {NgxsModule, Store} from '@ngxs/store';
import {UserState} from '@plusme/libs/states/user.state';
import {TagState} from '@plusme/libs/states/tag.state';
import {OnboardingComponent} from '@plusme/pages/onboarding/onboarding.component';
import {NgxsRouterPluginModule} from '@ngxs/router-plugin';
import {NavbarComponent} from '@plusme/components/navbar/navbar.component';
import {ImprintPage} from '@plusme/pages/imprint/imprint.page';
import {PrivacyPage} from '@plusme/pages/privacy/privacy.page';
import {TermsPage} from '@plusme/pages/terms/terms.page';
import {CreateQuestionComponent} from '@plusme/components/create-question/create-question.component';
import {QuestionState} from '@plusme/libs/states/question.state';
import {QuestionListItemComponent} from '@plusme/components/question-list-item/question-list-item';
import {MyQuestionsListComponent} from '@plusme/components/my-questions-list/my-questions-list.component';
import {AllAnsweredListComponent} from '@plusme/components/all-answered-list/all-answered-list.component';
import {InboxPage} from '@plusme/pages/inbox/inbox';
import {MyQuestionsPage} from '@plusme/pages/myQuestions/myQuestions';
import { ProfilePage } from '@plusme/pages/profile/profile.page';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';

const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, './assets/lang/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    AnswerBubbleComponent,
    QuestionBubbleComponent,
    ContactPage,
    FaqPage,
    LoginPage,
    RandomQuestionsPage,
    QuestionListItemComponent,
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
    CreateQuestionComponent,
    MyQuestionsListComponent,
    AllAnsweredListComponent,
    SearchQuestionsPage,
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
      ],
      {
        developmentMode: true,
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
    CreateQuestionComponent,
    MyQuestionsListComponent,
    AllAnsweredListComponent,
    SearchQuestionsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserServiceProvider,
    QuestionServiceProvider,
    NewsServiceProvider,
    TranslatedNotificationController,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (store: Store) => new AppInterceptor(store),
      multi: true,
      deps: [Store],
    },
  ]
})
export class AppModule {
}
