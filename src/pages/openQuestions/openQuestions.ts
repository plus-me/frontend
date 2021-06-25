import { Component, ViewChild } from '@angular/core';
import { NavController, IonContent, IonRefresher } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { EnterQuestionPage } from '../enterQuestion/enterQuestion';
import {QuestionServiceProvider} from "../../providers/question-service/question-service";
import { TranslatedNotificationController } from '../../utils/TranslatedNotificationController';
import {TagsHelper} from "../../utils/TagsHelper";
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

@Component({
  selector: 'page-open-questions',
  providers: [QuestionServiceProvider],
  templateUrl: 'openQuestions.html'
})
export class OpenQuestionsPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  enterQuestionView = EnterQuestionPage;
  public questions: Array<any>;
  public allTags;

  constructor(
    public navCtrl: NavController,
    public questionService: QuestionServiceProvider,
    public storage: Storage,
    private notifier: TranslatedNotificationController,
    public tagsHelper: TagsHelper,
  ) {
    this.allTags = this.storage.get('allTags');
  }

  ionViewDidEnter() {
    this.loadQuestions();
  }

  loadQuestions(refresher?: IonRefresher) {
    this
      .questionService
      .loadOpenQuestions()
      .subscribe(
      data => {
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
        data.sort((a, b) => b.upvotes - a.upvotes);
        this.questions = data;
      },
      err => {
        if (typeof refresher !== 'undefined') {
          refresher.complete();
        }
        this.notifier.showToast('CONNERROR');
      }
    );
  }

  loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
  }

  loadAnswerPage(question) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.Answers) //, {question: question});
  }

  loadSearchPage(tag) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); //, {tag: tag});
  }
}
