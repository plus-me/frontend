import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

@Component({
    selector: 'question-answer',
    providers: [],
    templateUrl: 'questionAnswer.html',
    styleUrls: ['questionAnswer.scss']
  })
export class QuestionAnswerPage {
    //@Select((store: GlobalState) => store.questions.questions)
    //public questions: Observable<QuestionModel>;
    //@Select((store: GlobalState) => store.tags)
    //public tags: Observable<TagModel>;
  
    constructor(
      private loadCtrl: LoadingController,
      private store: Store,
    ) {
    }
  }
  