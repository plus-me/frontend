import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { forkJoin, timer } from 'rxjs';
import { QuestionServiceProvider } from "../../providers/question-service/question-service";
import { TranslatedNotificationController } from "../../utils/TranslatedNotificationController";
import { TagsHelper } from "../../utils/TagsHelper";
import { AnswersPage } from "../answers/answers";
import { SearchQuestionsPage } from '../searchQuestions/searchQuestions';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

@Component({
  selector: 'page-randomQuestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'randomQuestions.html'
})
export class RandomQuestionsPage {
  questions = [];
  private seenQuestionIDs = new Set();

  constructor(private navCtrl: NavController, private loadCtrl: LoadingController,
              private notifier: TranslatedNotificationController,
              private questionService: QuestionServiceProvider, private tagsHelper: TagsHelper) {
  }

  private addQuestion(question) {
    if (!this.seenQuestionIDs.has(question.id)) {
      console.log("Add question " + question.id);
      this.seenQuestionIDs.add(question.id);
      this.questions.push(question);
    } else {
      console.log("Already seen " + question.id + " and " + this.questions.length + " left");
    }
  }

  public async ionViewDidEnter() {
    let loading = await this.loadCtrl.create();
    loading.present();
    this.questions = [];
    this.seenQuestionIDs.clear();
    forkJoin(
      this.questionService.loadRandomQuestion(),
      this.questionService.loadRandomQuestion(),
    )
    .subscribe(
      res => res.forEach(this.addQuestion, this),
      err => { loading.dismiss(); if (err.status != 429) this.notifier.showToast('CONNERROR'); },
      () => loading.dismiss()
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
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); //, {tag: tag});
  }

  downvote(question) {
    console.log('thumbs down for ' + question.id);
    timer(1000).subscribe(res => this.questions.shift());
    this.questionService.downvoteQuestion(question.id)
    .subscribe(null, err => this.notifier.showToast('CONNERROR'));
    this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  }

  upvote(question) {
    console.log('thumbs up for ' + question.id);
    timer(1000).subscribe(res => this.questions.shift());
    this.questionService.upvoteQuestion(question.id)
    .subscribe(null, err => this.notifier.showToast('CONNERROR'));
    this.questionService.loadRandomQuestion().subscribe(q => { this.addQuestion(q); });
  }

  reportQuestion(question) {
    this.questionService.reportQuestion(question.id)
    .subscribe(
      () => this.notifier.showAlert('', 'QUESTION.REPORT_CONFIRM', 'OK'),
      err => this.notifier.showToast('CONNERROR'));
  }
}
