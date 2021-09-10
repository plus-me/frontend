import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
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
import { TagModel } from '../models/tag.model';
import { GlobalState } from '../interfaces/global.state';
import { TranslatedNotificationController } from '@plusme/utils/TranslatedNotificationController';
import { Navigate } from '@ngxs/router-plugin';
import { FrontendRoutes } from '@plusme/libs/enums/frontend-routes.enum';

export interface QuestionStateInterface {
  randomQuestion: QuestionModel;
  questions: QuestionModel[];
  searchQuestions: QuestionModel[];
  answered: QuestionModel[];
  answeredQuestion: QuestionModel;
  searchText?: string;
}

@State<QuestionStateInterface>({
  name: 'questions'
})
@Injectable()
export class QuestionState {
  public constructor(
    private http: HttpClient,
    private store: Store,
    private notifier: TranslatedNotificationController,
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
    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.RandomQuestion),
      )
      .pipe(
        map((item ) => this.convertDataIntoQuestionWithTags(item)),
        tap(question => {
          ctx.patchState({
            randomQuestion: question,
          });
        }),
      );
  }

  @Action(QuestionActions.GetQuestion)
  public getQuestion(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.GetQuestion
  ) {
    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.Question, {id: action.questionId}),
      )
      .pipe(
        map((item ) => this.convertDataIntoQuestionWithTags(item)),
        tap(question => {
          ctx.patchState({
            answeredQuestion: question,
          });
        }),
      );
  }

  @Action(QuestionActions.ReportQuestion)
  public reportQuestion(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.ReportQuestion
  ) {
    return this
      .http
      .post(
        urlcat(API_ENDPOINT, BackendRoutes.ReportQuestion, {id: action.questionId}),
        JSON.stringify({
          reason: action.reason
        }),
      )
      .pipe(
        tap(question => {
          this.notifier.showToast('QUESTION.REPORT_CONFIRM');
          this.store.dispatch(new Navigate([FrontendRoutes.RandomQuestion]));
          ctx.patchState({
            answeredQuestion: null,
          });
        }),
      );
  }

  @Action(QuestionActions.GetMyQuestionsAction)
  public getMyQuestions(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    const isLoggedIn = this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn);

    if (!isLoggedIn) {
      ctx.patchState({
        questions: [],
      });
      return;
    }

    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.MyQuestions),
      )
      .pipe(
        map((data: unknown[]) => data.map((item) => this.convertDataIntoQuestionWithTags(item))),
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
    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.Questions, { search: action.searchText  }),
      )
      .pipe(
        map((data: { results: unknown[] }) => data.results.map((item) => this.convertDataIntoQuestionWithTags(item))),
        tap(questions => {
          ctx.patchState({
            searchQuestions: questions,
            searchText: action.searchText,
          });
          // this.store.dispatch(new Navigate([FrontendRoutes.SearchQuestions]));
        }),
      );
  }

  @Action(QuestionActions.GetAllAnsweredQuestionsAction)
  public getAllAnsweredQuestions(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.GetAllAnsweredQuestionsAction,
  ) {
    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.AnsweredQuestions),
      )
      .pipe(
        map((data: { results: unknown[] }) => data.results.map((item) => this.convertDataIntoQuestionWithTags(item))),
        tap(questions => {
          ctx.patchState({
            answered: questions,
          });
        }),
      );
  }

  @Action(QuestionActions.UpvoteQuestionAction)
  public upvoteQuestion(
    _ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.UpvoteQuestionAction,
  ) {
    const isLoggedIn = this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn);

    if (!isLoggedIn) {
      return this.store.dispatch(new Navigate([FrontendRoutes.Welcome]));
    }

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
    const isLoggedIn = this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn);

    if (!isLoggedIn) {
      return this.store.dispatch(new QuestionActions.GetRandomQuestionAction());
    }

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

  @Action(QuestionActions.ResetSearchQuestionsAction)
  public resetSearchQuestions(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    ctx.patchState({
      searchQuestions: [],
    });
  }

  private convertDataIntoQuestionWithTags(data: unknown) {
    if (data === null) {
      return undefined;
    }
    const allTags = this.store.selectSnapshot((state: GlobalState) => state.tags);
    const questionTags: TagModel[] = [];
    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (typeof data === 'object' && data !== null && Array.isArray(data['tags'])) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      for (const id of data['tags']) {
        if (typeof id === 'number') {
          questionTags.push(allTags.find(item => item.id === id));
        }
      }
    }

    const seenAnswers = this.store.selectSnapshot((state: GlobalState) => state.user.seen);
    let hasUnseenAnswers = false;

    // eslint-disable-next-line @typescript-eslint/dot-notation
    if (typeof data === 'object' && data !== null && Array.isArray(data['answers'])) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      for(const answer of data['answers']) {
        if (typeof answer === 'object' && 'id' in answer) {
          if (hasUnseenAnswers === false && !seenAnswers.includes(answer.id)) {
            hasUnseenAnswers = true;
          }
        }
      }
    }

    const question = plainToClass(
      QuestionModel,
      data,
      { excludeExtraneousValues: true });

    question.tags = questionTags;
    question.hasUnseenAnswers = hasUnseenAnswers;

    return question;
  }

}
