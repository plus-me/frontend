import {Component, Input} from '@angular/core';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import {Select} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';
import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';

@Component({
  selector: 'app-my-questions-list',
  providers: [QuestionServiceProvider],
  templateUrl: 'my-questions-list.component.html',
  styleUrls: ['my-questions-list.component.scss']
})
export class MyQuestionsListComponent {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel[]>;
  @Input()
  public answeredOnly: boolean;

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
