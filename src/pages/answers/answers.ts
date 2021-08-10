import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {Select, Store} from '@ngxs/store';
import {GlobalState} from '@plusme/libs/interfaces/global.state';

import {AnswerActions } from '@plusme/libs/actions/answers.action';
import {Observable} from 'rxjs';
import {QuestionModel} from '@plusme/libs/models/question.model';
import {TagModel} from '@plusme/libs/models/tag.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-answers',
  templateUrl: 'answers.html',
  styleUrls: ['answers.scss']
})
export class AnswersPage {
  @Select((store: GlobalState) => store.answers.answers)
  public answers: Observable<QuestionModel>;
  @Select((store: GlobalState) => store.tags)
  public tags: Observable<TagModel>;

  constructor(
    private loadCtrl: LoadingController,
    private store: Store,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  public async ionViewDidEnter() {
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new AnswerActions.GetAnswersAction(this.activatedRoute.snapshot.params.id))
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          console.log('ERROR');
          await loading.dismiss();
        },
      );
  }

  loadAnswerPage($event) {
    console.log('GOANSWERS-Event:', $event);
  }

  loadSearchPage($event) {
    console.log('GOSEARCH-Event:', $event);
  }
}
