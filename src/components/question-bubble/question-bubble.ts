import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';
import {Observable} from 'rxjs';
import {TagModel} from '@plusme/libs/models/tag.model';
import {TranslateService} from '@ngx-translate/core';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { Navigate } from '@ngxs/router-plugin';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

/*eslint no-underscore-dangle: [0]*/

@Component({
  selector: 'app-question-bubble',
  templateUrl: 'question-bubble.html',
  styleUrls: ['./question-bubble.scss'],
})

export class QuestionBubbleComponent {
  @Input()
  question: QuestionModel;

  @Input()
  enableDownvote = true;

  @Input()
  enableUpvote = true;

  constructor(
    private translator: TranslateService,
    private store: Store,
  ) {}

  public downvoteQuestion() {
    this
      .store
      .dispatch(new QuestionActions.DownvoteQuestionAction(
        this.question
      ))
      .subscribe(() => this.store.dispatch(new QuestionActions.GetRandomQuestionAction()));
  }

  upvoteQuestion() {
    this
      .store
      .dispatch(new QuestionActions.UpvoteQuestionAction(
        this.question,
      ))
      .subscribe(() => this.store.dispatch(new QuestionActions.GetRandomQuestionAction()));
  }

  public search(text: string) {
    this.store.dispatch(new QuestionActions.SearchQuestionsAction(text));
  }

  public reportQuestion() {
    this.store.dispatch(new Navigate([FrontendRoutes.ReportQuestion, {id: this.question.id}]));
  }


}
