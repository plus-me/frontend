import { Routes } from '@angular/router';
import { OnboardingComponent } from '@plusme/pages/onboarding/onboarding.component';
import { FrontendRoutes } from '@plusme/libs//enums/frontend-routes.enum';
import { AuthGuard } from '@plusme/libs/guards/auth.guard';
import { ContactPage } from '@plusme/pages/contact/contact.page';
import { FaqPage } from '@plusme/pages/faq/faq';
import { LoginPage } from '@plusme/pages/login/login';
import { RandomQuestionsPage } from '@plusme/pages/randomQuestions/randomQuestions';
import { SignUpPage } from '@plusme/pages/signUp/signUp';
import { WelcomePage } from '@plusme/pages/welcome/welcome';
import { ImprintPage } from '@plusme/pages/imprint/imprint.page';
import { PrivacyPage } from '@plusme/pages/privacy/privacy.page';
import { TermsPage } from '@plusme/pages/terms/terms.page';
import { ProfilePage } from '@plusme/pages/profile/profile.page';
import { InboxPage } from '@plusme/pages/inbox/inbox';
import { MyQuestionsPage } from '@plusme/pages/myQuestions/myQuestions';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';
import { AnswersPage } from '@plusme/pages/answers/answers';
import { ReportQuestionPage } from '@plusme/pages/report/report';
import { MyDownVotedQuestionsPage } from '@plusme/pages/myDownvotes/myDownvotes';

export const AppRoutes: Routes = [
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
    path: FrontendRoutes.RandomQuestion,
    component: RandomQuestionsPage,
  },
  {
    path: FrontendRoutes.MyQuestions,
    component: MyQuestionsPage,
    canActivate: [AuthGuard],
  },
  {
    path: FrontendRoutes.Inbox,
    component: InboxPage,
  },
  {
    path: FrontendRoutes.MyDownVotedQuestions,
    component: MyDownVotedQuestionsPage,
    canActivate: [AuthGuard],
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
    path: FrontendRoutes.Onboarding,
    component: OnboardingComponent,
  },
  {
    path: FrontendRoutes.Imprint,
    component: ImprintPage,
  },
  {
    path: FrontendRoutes.Privacy,
    component: PrivacyPage,
  },
  {
    path: FrontendRoutes.Terms,
    component: TermsPage,
  },
  {
    path: FrontendRoutes.Profile,
    component: ProfilePage,
    canActivate: [AuthGuard]
  },
  {
    path: FrontendRoutes.Answers,
    component: AnswersPage,
  },
  {
    path: FrontendRoutes.ReportQuestion,
    component: ReportQuestionPage,
    canActivate: [AuthGuard]
  }
];
