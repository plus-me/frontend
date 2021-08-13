import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { GlobalState } from '@plusme/libs/interfaces/global.state';

import { AnswerActions } from '@plusme/libs/actions/answers.action';
import { Observable } from 'rxjs';
import { TagModel } from '@plusme/libs/models/tag.model';
import { ActivatedRoute } from '@angular/router';
import { AnswerModel } from '@plusme/libs/models/answer.model';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-page-answers',
  templateUrl: 'answers.html',
  styleUrls: ['answers.scss']
})
export class AnswersPage {
  @Select((store: GlobalState) => store.answers.answers)
  public answers: Observable<AnswerModel[]>;
  @Select((store: GlobalState) => store.questions.answeredQuestion)
  public question: Observable<QuestionModel>;
  @Select((store: GlobalState) => store.tags)
  public tags: Observable<TagModel>;

  public questionExpanded = false;

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
      .pipe(
        switchMap(() => {
          return this
            .store
            .dispatch(new QuestionActions.GetQuestion(this.activatedRoute.snapshot.params.id));
        }),
      )
      .subscribe(
        async () => {
          await loading.dismiss();
        },
        async () => {
          await loading.dismiss();
        },
      );
  }

  upvote(answer: AnswerModel) {
    // TODO: This only updoots and does not vote.
    console.log('Updooted answer:', answer);
    answer.hasVote = 'upvote';
  }

  downvote(answer: AnswerModel) {
    // TODO: This only downdoots and does not vote.
    console.log('Downdooted answer:', answer);

    answer.hasVote = 'downvote';
  }
}
