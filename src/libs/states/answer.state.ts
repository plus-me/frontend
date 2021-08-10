import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { AnswerActions } from '@plusme/libs/actions/answers.action';
import urlcat from 'urlcat';
import { API_ENDPOINT } from '@plusme/app/app.config';
import { BackendRoutes } from '@plusme/libs/enums/backend-routes.enum';
import { catchError, map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { AnswerModel } from '@plusme/libs/models/answer.model';

export interface AnswerStateInterface {
  answers: AnswerModel[];
}

@State<AnswerStateInterface>({
  name: 'answers'
})
@Injectable()
export class AnswerState {
  public constructor(
    private http: HttpClient,
    private store: Store,
  ) {
  }

  @Action(AnswerActions.GetAnswersAction)
  public getAnswers(
    ctx: StateContext<AnswerStateInterface>,
    action: AnswerActions.GetAnswersAction
  ) {
    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.Answers, { id: action.questionId }),
      )
      .pipe(
        map((data: unknown[]) => plainToClass(
          AnswerModel,
          data,
          { excludeExtraneousValues: true },
        )),
        tap(answers => {
          ctx.patchState({
            answers,
          });
        }),
      );
  }

  @Action(AnswerActions.UpvoteAnswerAction)
  public upvoteAnswer(
    _ctx: StateContext<AnswerStateInterface>,
    action: AnswerActions.UpvoteAnswerAction,
  ) {
    return this
      .http
      .post(
        urlcat(
          API_ENDPOINT,
          BackendRoutes.UpVoteAnswer,
          { id: action.answer.id },
        ),
        '',
      );
  }

  @Action(AnswerActions.DownvoteAnswerAction)
  public downvoteAnswer(
    _ctx: StateContext<AnswerStateInterface>,
    action: AnswerActions.DownvoteAnswerAction,
  ) {
    return this
      .http
      .post(
        urlcat(
          API_ENDPOINT,
          BackendRoutes.DownVoteAnswer,
          { id: action.answer.id },
        ),
        '',
      );
  }
}
