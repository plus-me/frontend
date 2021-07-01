import { Component, ViewChild } from '@angular/core';
import { IonContent, NavController, NavParams, IonRefresher } from '@ionic/angular';
import { forkJoin, Observable } from 'rxjs';
import { TranslatedNotificationController } from '../../utils/TranslatedNotificationController';
import { TagsHelper } from "../../utils/TagsHelper";
import { QuestionServiceProvider } from "../../providers/question-service/question-service";
import { AnswersPage } from "../answers/answers";
import { TagModel } from 'src/models/tag.model';
import { FrontendRoutes } from 'src/enums/frontend-routes.enum';

@Component({
  selector: 'page-search',
  templateUrl: 'searchQuestions.html'
})
export class SearchQuestionsPage {
  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonRefresher) refresher: IonRefresher;

  public tags: Observable<TagModel[]>;
  public selectedTags: number[] = [];
  public questions: Array<any>;
  public voting: boolean = false;

  constructor(
    private navCtrl: NavController,
    navParams: NavParams,
    private tagsHelper: TagsHelper,
    private notifier: TranslatedNotificationController,
    private questionService: QuestionServiceProvider,
  ) {
    this.tags = this.tagsHelper.getAllTagObjectsSorted();
    let tag = navParams.get('tag');
    console.log("Search questions for tag: " + tag);
    if (tag !== undefined) {
      this.selectedTags = [tag.id];
    }
  }

  ionViewDidEnter() {
    this.selectTags();
  }

  selectTags() {
    this.loadQuestionsForTags();
  }

  loadQuestionsForTags() {
    console.log("Load questions for tags " + this.selectedTags);
    this.questions = [];
    let obs = [];
    for (let t of this.selectedTags) {
      obs.push(this.questionService.loadQuestionByTagId(t));
    }
    if (this.selectedTags.length == 0) obs.push(this.questionService.loadAllQuestions('?ordering=-upvotes'));
    forkJoin(obs).subscribe(
      res => {
        var seen = [];
        this.questions = [].concat.apply([], res)
          /* Filter questions with all tags */
          .filter(question => this.selectedTags.every(t => question.tags.includes(t)))
        /* Filter duplicate questions */
        .filter(question => seen.includes(question.id) ? false : seen.push(question.id))
        /* Filter closed questions */
        .filter(question => !question.closed);
        this.questions.sort((a, b) => b.upvotes - a.upvotes);
        this.refresher.complete();
      },
      err => { this.refresher.complete(); this.notifier.showToast('CONNERROR'); }
    );
  }

  loadAnswerPage(question) {
    // TODO
    this.navCtrl.navigateForward(FrontendRoutes.Answers); //, {question: question});
  }

  upvoteQuestion(question) {
    console.log('thumbs up for question ' + question.id);
    this.questionService.upvoteQuestion(question.id).subscribe(
      question => this.questions[this.questions.indexOf(question)] = question,
      err => this.notifier.showToast('CONNERROR')
    );
  }

}
