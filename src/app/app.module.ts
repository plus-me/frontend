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
import { EnterQuestionPage } from '@plusme/pages/enterQuestion/enterQuestion';
import { FaqPage } from '@plusme/pages/faq/faq';
import { LoginPage } from '@plusme/pages/login/login';
import { MainMenuPage } from '@plusme/pages/mainMenu/mainMenu';
import { OpenQuestionsPage } from '@plusme/pages/openQuestions/openQuestions';
import { NewsPage } from '@plusme/pages/news/news';
import { RandomQuestionsPage } from '@plusme/pages/randomQuestions/randomQuestions';
import { SearchQuestionsPage } from '@plusme/pages/searchQuestions/searchQuestions';
import { SignUpPage } from '@plusme/pages/signUp/signUp';
import { TabsPage } from '@plusme/pages/tabs/tabs';
import { WelcomePage } from '@plusme/pages/welcome/welcome';

import { NewsServiceProvider } from '@plusme/providers/news-service/news-service';
import { QuestionServiceProvider } from '@plusme/providers/question-service/question-service';
import { UserServiceProvider } from '@plusme/providers/user-service/user-service';
import { TagsServiceProvider } from '@plusme/providers/tags-service/tags-service';

import { TagsHelper } from '@plusme/utils/TagsHelper';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { AppRoutes } from './app-routing';
import { AppInterceptor } from '@plusme/libs/interceptors/app.interceptor';
import { Drivers } from '@ionic/storage';
import { NgxsModule, Store } from '@ngxs/store';
import { UserState } from '@plusme/libs/states/user.state';
import { TagState } from '@plusme/libs/states/tag.state';

const createTranslateLoader = (http: HttpClient) => new TranslateHttpLoader(http, './assets/lang/', '.json');

@NgModule({
  declarations: [
    AppComponent,
    AnswerBubbleComponent,
    QuestionBubbleComponent,
    AnsweredQuestionsPage,
    AnswersPage,
    ContactPage,
    EnterQuestionPage,
    FaqPage,
    LoginPage,
    MainMenuPage,
    OpenQuestionsPage,
    NewsPage,
    RandomQuestionsPage,
    SearchQuestionsPage,
    SignUpPage,
    TabsPage,
    WelcomePage,
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
    })
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AppComponent,
    AnsweredQuestionsPage,
    AnswersPage,
    ContactPage,
    EnterQuestionPage,
    FaqPage,
    LoginPage,
    MainMenuPage,
    OpenQuestionsPage,
    NewsPage,
    RandomQuestionsPage,
    SearchQuestionsPage,
    SignUpPage,
    TabsPage,
    WelcomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TagsHelper,
    UserServiceProvider,
    QuestionServiceProvider,
    TagsServiceProvider,
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
