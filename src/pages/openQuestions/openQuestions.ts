import { Component, ViewChild } from '@angular/core';
import { NavController, IonContent, IonRefresher } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-page-open-questions',
  providers: [QuestionServiceProvider],
  templateUrl: 'openQuestions.html'
})
export class OpenQuestionsPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  public questions: Array<any>;
  public allTags;

  constructor(
    public navCtrl: NavController,
    public questionService: QuestionServiceProvider,
    public storage: Storage,
    private notifier: TranslatedNotificationController,
  ) { }

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

  }

  loadAnswerPage(question) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.Answers); //, {question: question});
  }

  loadSearchPage(tag) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); //, {tag: tag});
  }
}
