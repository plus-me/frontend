import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {QuestionServiceProvider} from '@plusme/providers/question-service/question-service';
import {Select, Store} from "@ngxs/store";
import {GlobalState} from "@plusme/libs/interfaces/global.state";

import {QuestionActions} from "@plusme/libs/actions/questions.action";
import {Observable} from "rxjs";
import {QuestionModel} from "@plusme/libs/models/question.model";
import {TagModel} from "@plusme/libs/models/tag.model";

@Component({
  selector: 'app-page-myquestions',
  providers: [QuestionServiceProvider],
  templateUrl: 'myQuestions.html'
})
export class MyQuestionsPage {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel>
  @Select((store: GlobalState) => store.tags)
  public tags: Observable<TagModel>

  constructor(
    private loadCtrl: LoadingController,
    private store: Store,
  ) {
  }

  public async ionViewDidEnter() {
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new QuestionActions.GetMyQuestionsAction())
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }

  loadAnswerPage($event) {
    console.log("GOANSWERS-Event:", $event);
  }

  loadSearchPage($event) {
    console.log("GOSEARCH-Event:", $event);
  }
}
