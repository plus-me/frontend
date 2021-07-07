import { Routes } from '@angular/router';
import { FrontendRoutes } from '../libs//enums/frontend-routes.enum';
import { AuthGuard } from '../libs/guards/auth.guard';
import { ContactPage } from 'src/pages/contact/contact';
import { EnterQuestionPage } from 'src/pages/enterQuestion/enterQuestion';
import { FaqPage } from 'src/pages/faq/faq';
import { LoginPage } from 'src/pages/login/login';
import { MainMenuPage } from 'src/pages/mainMenu/mainMenu';
import { NewsPage } from 'src/pages/news/news';
import { RandomQuestionsPage } from 'src/pages/randomQuestions/randomQuestions';
import { SearchQuestionsPage } from 'src/pages/searchQuestions/searchQuestions';
import { SignUpPage } from 'src/pages/signUp/signUp';
import { TabsPage } from 'src/pages/tabs/tabs';
import { WelcomePage } from 'src/pages/welcome/welcome';

export const AppRoutes: Routes = [
  {
    path: FrontendRoutes.Tabs,
    component: TabsPage,
    children: [
      {
        path: FrontendRoutes.FAQ,
        component: FaqPage,
      },
      {
        path: FrontendRoutes.Login,
        component: LoginPage,
      },
      {
        path: FrontendRoutes.SignUp,
        component: SignUpPage,
      },
      {
        path: FrontendRoutes.MainMenu,
        component: MainMenuPage,
        // canActivate: [AuthGuard],
      },
      {
        path: FrontendRoutes.RandomQuestion,
        component: RandomQuestionsPage,
        // canActivate: [AuthGuard],
      },
      {
        path: FrontendRoutes.SearchQuestions,
        component: SearchQuestionsPage,
        // canActivate: [AuthGuard],
      },
      {
        path: FrontendRoutes.Contact,
        component: ContactPage,
      },
      {
        path: FrontendRoutes.Welcome,
        component: WelcomePage,
      },
      {
        path: FrontendRoutes.EnterQuestion,
        component: EnterQuestionPage,
        // canActivate: [AuthGuard],
      },
      {
        path: FrontendRoutes.News,
        component: NewsPage,
      }
    ],
  },
];
