import {Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';

@Component({
  selector: 'app-all-answered-list',
  templateUrl: 'all-answered-list.component.html',
  styleUrls: ['all-answered-list.component.scss']
})
export class AllAnsweredListComponent {
  @Select((store: GlobalState) => store.questions.answered)
  public questions: Observable<QuestionModel[]>;
}
