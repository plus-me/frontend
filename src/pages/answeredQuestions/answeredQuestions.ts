import { Component, ViewChild } from '@angular/core';
import { NavController, IonContent, IonRefresher } from '@ionic/angular';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-page-answeredquestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'answeredQuestions.html'
})
export class AnsweredQuestionsPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  public questions: any;
  connectionErrorMsg: string;

  constructor(
    public navCtrl: NavController,
    public questionService: QuestionServiceProvider,
    public notifier: TranslatedNotificationController,
  ) {
  }

  ionViewDidEnter() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.loadAnsweredQuestions().subscribe(
      data => {
        this.refresher.complete();
        this.questions = data;
        if (data.length) {this.questionService.updateSeenAnsweredQuestions(data.map(d => d.next));}
      },
      () => {
        this.refresher.complete();
        this.notifier.showToast('CONNERROR');
      }
    );
  }

  loadTags(question) {

  }

  loadAnswerPage(question) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.Answers); //, {question: question});
  }

  loadSearchPage(tag) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); // SearchQuestionsPage, {tag: tag});
  }
}
