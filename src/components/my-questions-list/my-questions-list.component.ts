import {Component, Input} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';
import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';
import { QuestionActions } from '@plusme/libs/actions/questions.action';

@Component({
  selector: 'app-my-questions-list',
  templateUrl: 'my-questions-list.component.html',
  styleUrls: ['my-questions-list.component.scss']
})
export class MyQuestionsListComponent {
  @Select((store: GlobalState) => store.questions.myQuestions)
  public questions: Observable<QuestionModel[]>;
  @Input()
  public answeredOnly: boolean;
  @Select((state: GlobalState) => state.questions.myQuestionsPage)
  public page: Observable<number>;
  @Select((state: GlobalState) => state.questions.myQuestionsMaximumPage)
  public maximumPages: Observable<number>;

  constructor(
    private store: Store,
  ) {
  }

  async loadNextPage() {
    this.store.dispatch(new QuestionActions.LoadNextMyQuestionsPage(this.answeredOnly));
  }

  async loadPreviousPage() {
    this.store.dispatch(new QuestionActions.LoadPreviousMyQuestionsPage(this.answeredOnly));
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
