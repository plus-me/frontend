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

import { AppComponent } from './app.component';
import { AnswerBubbleComponent } from '../components/answer-bubble/answer-bubble';
import { QuestionBubbleComponent } from '../components/question-bubble/question-bubble';

import { AnsweredQuestionsPage } from '../pages/answeredQuestions/answeredQuestions';
import { AnswersPage} from '../pages/answers/answers';
import { ContactPage } from '../pages/contact/contact';
import { EnterQuestionPage } from '../pages/enterQuestion/enterQuestion';
import { FaqPage } from '../pages/faq/faq';
import { LoginPage } from '../pages/login/login';
import { MainMenuPage } from '../pages/mainMenu/mainMenu';
import { OpenQuestionsPage } from '../pages/openQuestions/openQuestions';
import { NewsPage } from '../pages/news/news';
import { RandomQuestionsPage } from '../pages/randomQuestions/randomQuestions';
import { SearchQuestionsPage } from '../pages/searchQuestions/searchQuestions';
import { SignUpPage } from '../pages/signUp/signUp';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';

import { NewsServiceProvider } from '../providers/news-service/news-service';
import { QuestionServiceProvider } from '../providers/question-service/question-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { TagsServiceProvider } from '../providers/tags-service/tags-service';

import { TagsHelper } from '../utils/TagsHelper';
import { TranslatedNotificationController } from '../utils/TranslatedNotificationController';
import { AppRoutes } from './app-routing';
import { AppInterceptor } from '../libs/interceptors/app.interceptor';
import { Drivers } from '@ionic/storage';
import { NgxsModule } from '@ngxs/store';
import { UserState } from 'src/libs/states/user.state';
import { TagState } from 'src/libs/states/tag.state';

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
      useFactory: (userService: UserServiceProvider) => new AppInterceptor(userService),
      multi: true,
      deps: [UserServiceProvider],
    },
  ]
})
export class AppModule {}
