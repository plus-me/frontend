import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { QuestionServiceProvider } from '@plusme/providers/question-service/question-service';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Select, Store } from '@ngxs/store';
import { QuestionActions } from '@plusme/libs/actions/questions.action';

@Component({
  selector: 'app-page-randomquestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'randomQuestions.html'
})
export class RandomQuestionsPage {
  @Select((store: GlobalState) => store.questions.randomQuestion)
  public question: Observable<QuestionModel>;

  constructor(
    private loadCtrl: LoadingController,
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
