import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy, RouterModule } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { AppComponent } from './app.component';
import { AnswerBubbleComponent } from '@plusme/components/answer-bubble/answer-bubble';
import { QuestionBubbleComponent } from '@plusme/components/question-bubble/question-bubble';

import { AnsweredQuestionsPage } from '@plusme/pages/answeredQuestions/answeredQuestions';
import { AnswersPage} from '@plusme/pages/answers/answers';
import { ContactPage } from '@plusme/pages/contact/contact';
import { FaqPage } from '@plusme/pages/faq/faq';
import { LoginPage } from '@plusme/pages/login/login';
import { MainMenuPage } from '@plusme/pages/mainMenu/mainMenu';
import { OpenQuestionsPage } from '@plusme/pages/openQuestions/openQuestions';
import { NewsPage } from '@plusme/pages/news/news';
import { RandomQuestionsPage } from '@plusme/pages/randomQuestions/randomQuestions';
import { SearchQuestionsPage } from '@plusme/pages/searchQuestions/searchQuestions';
import { SignUpPage } from '@plusme/pages/signUp/signUp';
import { WelcomePage } from '@plusme/pages/welcome/welcome';

import { NewsServiceProvider } from '@plusme/providers/news-service/news-service';
import { QuestionServiceProvider } from '@plusme/providers/question-service/question-service';
import { UserServiceProvider } from '@plusme/providers/user-service/user-service';
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


const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, './assets/lang/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    AnswerBubbleComponent,
    QuestionBubbleComponent,
    AnsweredQuestionsPage,
    AnswersPage,
    ContactPage,
    FaqPage,
    LoginPage,
    MainMenuPage,
    OpenQuestionsPage,
    NewsPage,
    RandomQuestionsPage,
    SearchQuestionsPage,
    SignUpPage,
    WelcomePage,
    OnboardingComponent,
    NavbarComponent,
    ImprintPage,
    PrivacyPage,
    TermsPage,
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
    NgxsModule.forRoot([
      UserState,
      TagState,
    ]),
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
    AnsweredQuestionsPage,
    AnswersPage,
    ContactPage,
    FaqPage,
    LoginPage,
    MainMenuPage,
    OpenQuestionsPage,
    NewsPage,
    RandomQuestionsPage,
    SearchQuestionsPage,
    SignUpPage,
    WelcomePage,
    OnboardingComponent,
    ImprintPage,
    PrivacyPage,
    TermsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    UserServiceProvider,
    QuestionServiceProvider,
    NewsServiceProvider,
    TranslatedNotificationController,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: (store: Store) => new AppInterceptor(store),
      multi: true,
      deps: [Store],
    },
  ]
})
export class AppModule {}
