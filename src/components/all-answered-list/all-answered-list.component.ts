import {Component} from '@angular/core';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';
import {TagModel} from '@plusme/libs/models/tag.model';

@Component({
  selector: 'app-all-answered-list',
  providers: [QuestionServiceProvider],
  templateUrl: 'all-answered-list.component.html',
  styleUrls: ['all-answered-list.component.scss']
})
export class AllAnsweredListComponent {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel>;
  @Select((store: GlobalState) => store.tags)
  public tags: Observable<TagModel>;

  constructor(
  ) {
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
