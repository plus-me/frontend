import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';
import { Observable } from 'rxjs';
import { TagModel } from '@plusme/libs/models/tag.model';
import { ActivatedRoute } from '@angular/router';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { QuestionModel } from '@plusme/libs/models/question.model';

@Component({
  selector: 'app-page-report-question',
  templateUrl: 'report.html',
  styleUrls: ['report.scss']
})
export class ReportQuestionPage {
  @Select((store: GlobalState) => store.questions.answeredQuestion)
  public question: Observable<QuestionModel>;
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
        .dispatch(new QuestionActions.GetQuestion(this.activatedRoute.snapshot.params.id))
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }

  report() {
    this.store.dispatch(new QuestionActions.ReportQuestion(this.activatedRoute.snapshot.params.id, 'no reason'));
  }
}
