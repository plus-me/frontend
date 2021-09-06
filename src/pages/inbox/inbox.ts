import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

import {QuestionActions} from '@plusme/libs/actions/questions.action';
import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';
import {TagModel} from '@plusme/libs/models/tag.model';

@Component({
  selector: 'app-page-inbox',
  templateUrl: 'inbox.html',
  styleUrls: ['inbox.scss']
})
export class InboxPage {
  @Select((store: GlobalState) => store.questions.questions)
  public questions: Observable<QuestionModel>;
  @Select((store: GlobalState) => store.tags)
  public tags: Observable<TagModel>;

  public mode: string;

  constructor(
    private loadCtrl: LoadingController,
    private store: Store,
  ) {
  }

  public async select_mine() {
    this.mode = 'mine';
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

  public async select_all() {
    this.mode = 'all';
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new QuestionActions.GetAllAnsweredQuestionsAction())
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }


  public async ionViewDidEnter() {
    this.store.dispatch(new QuestionActions.ResetMyQuestionsAction());
    await this.select_mine();
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
