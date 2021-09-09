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
import { ModalController } from '@ionic/angular';
import { SearchQuestionsPage } from '@plusme/pages/search/searchQuestions';

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
  @Input() enableReporting = true;
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
    private modalController: ModalController,
  ) {
  }

  public downvoteQuestion(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    this
      .store
      .dispatch(new QuestionActions.DownvoteQuestionAction(
        this.question
      )).subscribe(data => {
      this.hidden = true;
      this.question.voted = true;
    });
  }

  upvoteQuestion(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
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

  public async getQuestionsByTag(event: Event, tag: TagModel) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    const isModal = await this.isModal();

    if (!isModal) {
      const searchModal = await this.modalController.create({
        component: SearchQuestionsPage,
        animated: false,
      });
      await searchModal.present();
    }

    this.store.dispatch(new QuestionActions.GetQuestionsByTagAction(tag));
    return false;
  }

  public gotoAnswers() {
    if (this.question.answers.length > 0) {
      this.hideModal();
      this.store.dispatch(new Navigate([FrontendRoutes.Answers, { id: this.question.id }]));
    }
  }

  public reportQuestion(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
    this.hideModal();
    this.store.dispatch(new Navigate([FrontendRoutes.ReportQuestion, {id: this.question.id}]));
  }

  private async isModal() {
    const overlay = await this.modalController.getTop();

    return typeof overlay !== 'undefined';
  }

  private async hideModal() {
    const overlay = await this.modalController.getTop();

    if (typeof overlay !== 'undefined') {
      await overlay.dismiss();
    }
  }
}
