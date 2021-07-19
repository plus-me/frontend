import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin, timer } from 'rxjs';
import { QuestionServiceProvider } from '@plusme/providers/question-service/question-service';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { TagsHelper } from '@plusme/utils/TagsHelper';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-page-randomquestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'randomQuestions.html'
})
export class RandomQuestionsPage {
  questions = [];
  private seenQuestionIDs = new Set();

  constructor(
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private notifier: TranslatedNotificationController,
    private questionService: QuestionServiceProvider,
    private tagsHelper: TagsHelper,
  ) { }

  public async ionViewDidEnter() {
    const loading = await this.loadCtrl.create();
    loading.present();
    this.questions = [];
    this.seenQuestionIDs.clear();
    forkJoin(
      this.questionService.loadRandomQuestion(),
      this.questionService.loadRandomQuestion(),
    )
    .subscribe(
      res => res.forEach(this.addQuestion, this),
      err => { loading.dismiss(); if (err.status !== 429) {this.notifier.showToast('CONNERROR');} },
      () => loading.dismiss()
    );
  }

  public loadTags(question) {
    return this.tagsHelper.getTagObjects(question.tags);
  }

  public loadAnswerPage(question) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.Answers); //, {question: question});
  }

  public loadSearchPage(tag) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); //, {tag: tag});
  }

  public downvote(question) {
    console.log('thumbs down for ' + question.id);
    timer(1000).subscribe(res => this.questions.shift());
    this.questionService.downvoteQuestion(question.id)
    .subscribe(null, err => this.notifier.showToast('CONNERROR'));
    this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  }

  public upvote(question) {
    console.log('thumbs up for ' + question.id);
    timer(1000).subscribe(res => this.questions.shift());
    this.questionService.upvoteQuestion(question.id)
    .subscribe(null, err => this.notifier.showToast('CONNERROR'));
    this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  }

  public reportQuestion(question) {
    this.questionService.reportQuestion(question.id)
    .subscribe(
      () => this.notifier.showAlert('', 'QUESTION.REPORT_CONFIRM', 'OK'),
      err => this.notifier.showToast('CONNERROR'));
  }

  private addQuestion(question) {
    if (!this.seenQuestionIDs.has(question.id)) {
      console.log('Add question ' + question.id);
      this.seenQuestionIDs.add(question.id);
      this.questions.push(question);
    } else {
      console.log('Already seen ' + question.id + ' and ' + this.questions.length + ' left');
    }
  }
}
