import { Routes } from '@angular/router';
import { FrontendRoutes } from '@plusme/libs//enums/frontend-routes.enum';
import { AuthGuard } from '@plusme/libs/guards/auth.guard';
import { ContactPage } from '@plusme/pages/contact/contact';
import { EnterQuestionPage } from '@plusme/pages/enterQuestion/enterQuestion';
import { FaqPage } from '@plusme/pages/faq/faq';
import { LoginPage } from '@plusme/pages/login/login';
import { MainMenuPage } from '@plusme/pages/mainMenu/mainMenu';
import { NewsPage } from '@plusme/pages/news/news';
import { RandomQuestionsPage } from '@plusme/pages/randomQuestions/randomQuestions';
import { SearchQuestionsPage } from '@plusme/pages/searchQuestions/searchQuestions';
import { SignUpPage } from '@plusme/pages/signUp/signUp';
import { TabsPage } from '@plusme/pages/tabs/tabs';
import { WelcomePage } from '@plusme/pages/welcome/welcome';

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
