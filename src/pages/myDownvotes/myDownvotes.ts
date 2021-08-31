import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

import {QuestionActions} from '@plusme/libs/actions/questions.action';
import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';
import {TagModel} from '@plusme/libs/models/tag.model';

@Component({
  selector: 'app-page-mydownvotes',
  templateUrl: 'myDownvotes.html',
  styleUrls: ['myDownvotes.scss']
})
export class MyDownVotedQuestionsPage {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel>;


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
      .dispatch(new QuestionActions.GetMyQuestionsAction(true))
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }
}
