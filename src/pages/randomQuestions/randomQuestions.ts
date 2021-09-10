import { Component } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { UserActions } from '@plusme/libs/actions/users.actions';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { QuestionModel } from '@plusme/libs/models/question.model';


@Component({
  selector: 'app-page-randomquestions',
  templateUrl: 'randomQuestions.html'
})
export class RandomQuestionsPage {
  @Select((store: GlobalState) => store.questions.randomQuestion)
  public question: Observable<QuestionModel>;

  constructor(
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private store: Store,
  ) { }

  public async ionViewDidEnter() {
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new QuestionActions.GetRandomQuestionAction())
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );

    this.askForNotificationConsent();
  }

  async askForNotificationConsent() {
    const hasConsentedNotifications = this
      .store
      .selectSnapshot(
        (state: GlobalState) => state.user.hasConsentedNotifications
      );

    if (typeof hasConsentedNotifications !== 'undefined') {
      return;
    }

    const alert = await this.alertCtrl.create({
      header: this.translate.instant('notifications.askForConsentTitle'),
      message: this.translate.instant('notifications.askForConsentDescription'),
      buttons: [
        {
          text: this.translate.instant('notifications.denyNotifications'),
          role: 'cancel',
          handler: () => {
            this.store.dispatch(new UserActions.SetNotificationPreference(false));
          }
        },
        {
          text: this.translate.instant('notifications.consentNotifications'),
          handler: () => {
            this.store.dispatch(new UserActions.SetNotificationPreference(true));
          }
        }
      ]
    });

    await alert.present();
  }

  // public loadAnswerPage(question) {
  //   // TODO
  //   this.navCtrl.navigateForward(FrontendRoutes.Answers); //, {question: question});
  // }

  // public downvote(question) {
  //   console.log('thumbs down for ' + question.id);
  //   timer(1000).subscribe(res => this.questions.shift());
  //   this.questionService.downvoteQuestion(question.id)
  //   .subscribe(null, err => this.notifier.showToast('CONNERROR'));
  //   this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  // }

  // public upvote(question) {
  //   console.log('thumbs up for ' + question.id);
  //   timer(1000).subscribe(res => this.questions.shift());
  //   this.questionService.upvoteQuestion(question.id)
  //   .subscribe(null, err => this.notifier.showToast('CONNERROR'));
  //   this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  // }

  // public reportQuestion(question) {
  //   this.questionService.reportQuestion(question.id)
  //   .subscribe(
  //     () => this.notifier.showAlert('', 'QUESTION.REPORT_CONFIRM', 'OK'),
  //     err => this.notifier.showToast('CONNERROR'));
  // }

  // private addQuestion(question) {
  //   if (!this.seenQuestionIDs.has(question.id)) {
  //     console.log('Add question ' + question.id);
  //     this.seenQuestionIDs.add(question.id);
  //     this.questions.push(question);
  //   } else {
  //     console.log('Already seen ' + question.id + ' and ' + this.questions.length + ' left');
  //   }
  // }
}
