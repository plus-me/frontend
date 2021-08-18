import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Observable } from 'rxjs';
import { TagModel } from '@plusme/libs/models/tag.model';
import { TranslateService } from '@ngx-translate/core';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { Navigate } from '@ngxs/router-plugin';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';
import { UserStateInterface } from '@plusme/libs/states/user.state';

/*eslint no-underscore-dangle: [0]*/

@Component({
  selector: 'app-question-list-item',
  templateUrl: 'question-list-item.html',
  styleUrls: ['./question-list-item.scss'],
})

export class QuestionListItemComponent {
  @Select((store: GlobalState) => store.user)
  public user: Observable<UserStateInterface>;
  @ViewChild('questionlistitem') questionListItem;
  @Input() question: QuestionModel;
  @Input() enableDownvote = true;
  @Input() enableUpvote = true;
  @Input() voted = false;
  @Input() hideRelation = true;
  @Output() textClick = new EventEmitter<any>();
  @Output() tagClick = new EventEmitter<any>();
  @Output() upvote = new EventEmitter<any>();
  @Output() downvote = new EventEmitter<any>();
  @Output() voting = new EventEmitter<boolean>();

  public hidden = false;

  constructor(
    private store: Store,
  ) {
  }

  public downvoteQuestion() {
    this
      .store
      .dispatch(new QuestionActions.DownvoteQuestionAction(
        this.question
      )).subscribe(data => {
      this.hidden = true;
    });
  }

  upvoteQuestion() {
    this
      .store
      .dispatch(new QuestionActions.UpvoteQuestionAction(
        this.question,
      )).subscribe(data => {
      this.question.voted = true;
    });
  }

  public checkIfUnread() {
    // Needs to be synchronized with this.user.seen
    return this.question.answers.length > 0;
  }

  public getQuestionsByTag(tag: TagModel) {
    this.store.dispatch(new QuestionActions.GetQuestionsByTagAction(tag));
  }

  public gotoAnswers(question: QuestionModel) {
    this.store.dispatch(new Navigate([FrontendRoutes.Answers, { id: question.id }]));
  }

  public search(text: string) {
    this.store.dispatch(new QuestionActions.SearchQuestionsAction(text));
  }
}
