import { Component } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { QuestionServiceProvider } from '../../providers/question-service/question-service';
import { TranslatedNotificationController } from '../../utils/TranslatedNotificationController';
import { TagsHelper } from '../../utils/TagsHelper';
import { FrontendRoutes } from '../../libs/enums/frontend-routes.enum';

@Component({
  selector: 'app-page-answers',
  providers: [QuestionServiceProvider],
  templateUrl: 'answers.html'
})
export class AnswersPage {
  //This contains all answered questions

  public questions: any;
  connectionErrorMsg: string;
  question: any;
  answers: any[] = [];
  likePerc = 66;

  constructor(
    private navParams: NavParams,
    private navCtrl: NavController,
    private notifier: TranslatedNotificationController,
    private questionService: QuestionServiceProvider,
    private tagsHelper: TagsHelper,
  ) {
    this.question = navParams.get('question');
    console.log(this.question);
    this.loadTags();
    this.loadAnswers();
  }

  loadTags(){
    return this.tagsHelper.getTagObjects(this.question.tags);
  }

  loadAnswers() {
    if (this.question !== undefined && this.question !== []) {
      this
        .questionService
        .getAnswersForQuestion(this.question.id)
        .subscribe(
          (data: any) => { console.log(data); this.answers = data;},
          err => this.notifier.showToast('CONNERROR')
      );
    };
  }

  downvote(answer) {
    console.log('thumbs down ' + answer.id);
    this.questionService.downvoteAnswer(answer.id).
    subscribe(updatedAnswer => { this.loadAnswers(); });
  }

  upvote(answer) {
    console.log('thumbs up ' + answer.id);
    this.questionService.upvoteAnswer(answer.id).
    subscribe(updatedAnswer => { this.loadAnswers(); });
  }

  upvoteQuestion(question) {
    console.log('thumbs up for question ' + question.id);
    this.questionService.upvoteQuestion(question.id)
      .subscribe(innerQuestion => {
       console.log(innerQuestion);
       this.question = innerQuestion;
     });
  }

  loadSearchPage(tag) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.SearchQuestions); // SearchQuestionsPage, {tag: tag});
  }

  reportQuestion(question) {
    this
      .questionService
      .reportQuestion(question.id)
      .subscribe(
        () => this.notifier.showAlert('', 'QUESTION.REPORT_CONFIRM', 'OK'),
        () => this.notifier.showToast('CONNERROR'),
      );
  }
}
