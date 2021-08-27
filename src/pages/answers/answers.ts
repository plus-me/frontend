import { Component } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
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
import { SearchQuestionsPage } from '../search/searchQuestions';

@Component({
  selector: 'app-page-answers',
  templateUrl: 'answers.html',
  styleUrls: ['answers.scss']
})
export class AnswersPage {
  @Select((store: GlobalState) => store.answers)
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
    private modalController: ModalController,
  ) {
  }

  public async ionViewDidEnter() {
    const loading = await this.loadCtrl.create();
    await loading.present();

    this
      .store
      .dispatch(new AnswerActions.GetAnswersAction(this.activatedRoute.snapshot.params.id))
      .pipe(
        switchMap(() => this
            .store
            .dispatch(new QuestionActions.GetQuestion(this.activatedRoute.snapshot.params.id))),
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

  public async getQuestionsByTag(tag: TagModel) {
    const searchModal = await this.modalController.create({
      component: SearchQuestionsPage,
      animated: false,
    });

    await searchModal.present();

    this.store.dispatch(new QuestionActions.GetQuestionsByTagAction(tag));
  }

  upvote(answer: AnswerModel) {
    this.store.dispatch(new AnswerActions.UpvoteAnswerAction(answer));
  }

  downvote(answer: AnswerModel) {
    this.store.dispatch(new AnswerActions.DownvoteAnswerAction(answer));
  }
}
