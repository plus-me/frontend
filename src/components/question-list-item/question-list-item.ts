import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';
import {Observable} from 'rxjs';
import {TagModel} from '@plusme/libs/models/tag.model';
import {TranslateService} from '@ngx-translate/core';
import {QuestionActions} from '@plusme/libs/actions/questions.action';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { Navigate } from '@ngxs/router-plugin';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

/*eslint no-underscore-dangle: [0]*/

@Component({
  selector: 'app-question-list-item',
  templateUrl: 'question-list-item.html',
  styleUrls: ['./question-list-item.scss'],
})

export class QuestionListItemComponent {
  @Select((state: GlobalState) => state.tags)
  public tags: Observable<TagModel>;
  @Input() hideRelation = true;

  @ViewChild('questionlistitem') questionListItem;
  @Input() question: any;
  @Input() enableDownvote = true;
  @Input() enableUpvote = true;
  @Output() textClick = new EventEmitter<any>();
  @Output() tagClick = new EventEmitter<any>();
  @Output() upvote = new EventEmitter<any>();
  @Output() downvote = new EventEmitter<any>();
  @Output() voting = new EventEmitter<boolean>();

  public tags$: Observable<TagModel[]>;

  constructor(
    private store: Store,
  ) {
  }

  downvoteQuestion() {
    if (this.enableDownvote && this.question.voted === null) {
      this.downvote.emit(this.question);
      this.question.voted = false;
    }
  }

  upvoteQuestion() {
    if (this.enableUpvote && !this.question.voted) {
      this.upvote.emit(this.question);
      this.question.voted = true;
      this.question.upvotes += 1;
    }
  }

  public gotoAnswers(question: QuestionModel) {
    this.store.dispatch(new Navigate([FrontendRoutes.Answers, {id: question.id}]));
  }
  public search(text: string) {
    this.store.dispatch(new QuestionActions.SearchQuestionsAction(text));
  }
}
