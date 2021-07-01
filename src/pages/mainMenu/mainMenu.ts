import { Component } from '@angular/core';

import { NewsServiceProvider } from "../../providers/news-service/news-service";
import { QuestionServiceProvider } from "../../providers/question-service/question-service";

import { OpenQuestionsPage } from "../openQuestions/openQuestions";
import { NewsPage } from "../news/news";
import { EnterQuestionPage } from "../enterQuestion/enterQuestion";
import { AnsweredQuestionsPage } from "../answeredQuestions/answeredQuestions";
import { NavController } from '@ionic/angular';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

@Component({
  selector: 'page-main',
  templateUrl: 'mainMenu.html'
})
export class MainMenuPage {

  openQuestionsView = OpenQuestionsPage;
  answeredQuestionsView = AnsweredQuestionsPage;
  enterQuestionView = EnterQuestionPage;
  newsView = NewsPage;
  unseenAnswered: number = 0;
  unseenNews: number = 0;

  constructor(
    private newsService: NewsServiceProvider,
    private questionService: QuestionServiceProvider,
    private navCtrl: NavController,
  ) {
  }

  ionViewWillEnter() {
    // this.newsService.unseenNews().subscribe(unseen => this.unseenNews = unseen);
    // this.questionService.unseenAnsweredQuestions().subscribe(unseen => this.unseenAnswered = unseen);
  }

  public goToOpenQuestionsView() {
    // this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions);
  }

  public goToAnsweredQuestionsView() {}
  public goToEnterQuestionView() {
    // this.navCtrl.navigateForward(FrontendRoutes.EnterQuestion);
  }
  public goToNewsView() {
    // this.navCtrl.navigateForward(FrontendRoutes.News)
  }

}
