import { Component, ViewChild } from '@angular/core';
import { NavController, IonContent, IonRefresher } from '@ionic/angular';
import {QuestionServiceProvider} from "../../providers/question-service/question-service";
import { TranslatedNotificationController } from '../../utils/TranslatedNotificationController';
import {TagsHelper} from "../../utils/TagsHelper";
import {AnswersPage} from "../answers/answers";
import {SearchQuestionsPage} from '../searchQuestions/searchQuestions';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

@Component({
  selector: 'page-answeredQuestions',
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
    public tagsHelper: TagsHelper,
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
        if (data.length) this.questionService.updateSeenAnsweredQuestions(data.map(d => d.next));
      },
      () => {
        this.refresher.complete();
        this.notifier.showToast('CONNERROR');
      }
    );
  }

  loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
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
