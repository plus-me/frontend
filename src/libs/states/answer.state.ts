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
import { UserActions } from '@plusme/libs/actions/users.actions';

@State<AnswerModel[]>({
  name: 'answers',
  defaults: [],
})
@Injectable()
export class AnswerState {
  public constructor(
    private http: HttpClient,
  ) {
  }

  @Action(AnswerActions.GetAnswersAction)
  public getAnswers(
    ctx: StateContext<AnswerModel[]>,
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
          answers.sort(this.sort);
          ctx.setState(answers);
          ctx.dispatch(new UserActions.MarkSeen(action.questionId));
        }),
      );
  }

  @Action(AnswerActions.UpvoteAnswerAction)
  public upvoteAnswer(
    ctx: StateContext<AnswerModel[]>,
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
      )
      .pipe(
        tap(() => {
          const answers = ctx.getState().filter(item => item.id !== action.answer.id);

          const answer = new AnswerModel();
          Object.assign(answer, action.answer);
          answer.voted = 'upvote';

          const newAnswers = [
            ...answers,
            answer,
          ];

          newAnswers.sort(this.sort);

          ctx.setState(newAnswers);
        }),
      );
  }

  @Action(AnswerActions.DownvoteAnswerAction)
  public downvoteAnswer(
    _ctx: StateContext<AnswerModel[]>,
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
      )
    .pipe(
      tap(() => {
          const answers = _ctx.getState().filter(item => item.id !== action.answer.id);

          const answer = new AnswerModel();
          Object.assign(answer, action.answer);
          answer.voted = 'downvote';

          const newAnswers = [
            ...answers,
            answer,
          ];

          newAnswers.sort(this.sort);

          _ctx.setState(newAnswers);
        }),
    );
  }

  private sort(a: AnswerModel, b: AnswerModel) {
    return a.id - b.id;
  }
}
