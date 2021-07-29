import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';
import {Observable} from 'rxjs';
import {TagModel} from '@plusme/libs/models/tag.model';
import {TranslateService} from '@ngx-translate/core';

/*eslint no-underscore-dangle: [0]*/

@Component({
  selector: 'app-question-list-item',
  templateUrl: 'question-list-item.html',
  styleUrls: ['./question-list-item.scss'],
})

export class QuestionListItemComponent {
  @Select((state: GlobalState) => state.tags)
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

  private _panState = 'idle';

  constructor(
    private translator: TranslateService,
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
}
