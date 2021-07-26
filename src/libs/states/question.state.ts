import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { QuestionActions } from '@plusme/libs/actions/questions.action';
import urlcat from 'urlcat';
import { API_ENDPOINT } from '@plusme/app/app.config';
import { BackendRoutes } from '@plusme/libs/enums/backend-routes.enum';
import { catchError, map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { QuestionModel } from '@plusme/libs/models/question.model';
import { ValidationError } from '../errors/validation.error';
import { UnknownHttpError } from '../errors/unknown-http.error';
import { UnknownError } from '../errors/unknown.error';

interface QuestionStateInterface {
  randomQuestion: QuestionModel;
  questions: QuestionModel[];
}

@State<QuestionStateInterface>({
  name: 'questions'
})
@Injectable()
export class QuestionState {
  public constructor(
    private http: HttpClient,
  ) {}

  @Action(QuestionActions.CreateQuestionAction)
  public createQuestion(
    _ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.CreateQuestionAction,
  ) {
    return this
      .http
      .post(
        urlcat(API_ENDPOINT, BackendRoutes.Questions),
        JSON.stringify({
          text: action.text,
          tags: action.tags.map(item => item.id),
        }),
      )
      .pipe(
        catchError((error: unknown) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 400) {
              throw new ValidationError({
                ...error.error,
              });
            }

            throw new UnknownHttpError(error);

          }

          throw new UnknownError(error);
        }),
      );
  }

  @Action(QuestionActions.GetRandomQuestionAction)
  public getRandomQuestion(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.RandomQuestion),
      )
      .pipe(
        map((data: unknown) => plainToClass(
          QuestionModel,
          data,
          { excludeExtraneousValues: true },
        )),
        tap(question => {
          ctx.patchState({
            randomQuestion: question,
          });
        }),
      );
  }

  @Action(QuestionActions.GetMyQuestionsAction)
  public getMyQuestions(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.MyQuestions),
      )
      .pipe(
        map((data: unknown[]) => plainToClass(
          QuestionModel,
          data,
          { excludeExtraneousValues: true },
        )),
        tap(questions => {
          ctx.patchState({
            questions,
          });
        }),
      );
  }

  @Action(QuestionActions.SearchQuestionsAction)
  public searchQuestions(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.SearchQuestionsAction,
  ) {
    this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.Questions, { search: action.searchText  }),
      )
      .pipe(
        map((data: unknown[]) => plainToClass(
          QuestionModel,
          data,
          { excludeExtraneousValues: true },
        )),
        tap(questions => {
          ctx.patchState({
            questions,
          });
        }),
      );
  }

  @Action(QuestionActions.UpvoteQuestionAction)
  public upvoteQuestion(
    _ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.UpvoteQuestionAction,
  ) {
    return this
      .http
      .post(
        urlcat(
          API_ENDPOINT,
          BackendRoutes.UpvoteQuestion,
          { id: action.question.id  },
        ),
        '',
      );
  }

  @Action(QuestionActions.DownvoteQuestionAction)
  public downvoteQuestion(
    _ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.DownvoteQuestionAction,
  ) {
    return this
      .http
      .post(
        urlcat(
          API_ENDPOINT,
          BackendRoutes.DownvoteQuestion,
          { id: action.question.id  },
        ),
        '',
      );
  }

}
