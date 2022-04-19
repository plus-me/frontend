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
import { NotEnoughReputationError } from '../errors/not-enough-reputation.error';

export interface QuestionStateInterface {
  randomQuestion: QuestionModel;
  questions: QuestionModel[];
  myQuestions: QuestionModel[];
  searchQuestions: QuestionModel[];
  answered: QuestionModel[];
  answeredQuestion: QuestionModel;
  searchText?: string;
  searchPage: number;
  sorting: string;
  searchMaximumPages: number;
  myQuestionsPage: number;
  myQuestionsMaximumPage: number;
}

@State<QuestionStateInterface>({
  name: 'questions',
  defaults: {
    randomQuestion: undefined,
    questions: [],
    myQuestions: [],
    searchQuestions: [],
    answered: [],
    answeredQuestion: undefined,
    searchPage: 1,
    sorting: 'newest',
    searchMaximumPages: 0,
    myQuestionsPage: 1,
    myQuestionsMaximumPage: 0,
  }
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
            if ((error.status === 420) && (error.error.detail === 'Not enough reputation')) {
              throw new NotEnoughReputationError();
            } else if (error.status === 400) {
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
    action: QuestionActions.GetMyQuestionsAction,
  ) {
    const isLoggedIn = this.store.selectSnapshot((state: GlobalState) => state.user.isLoggedIn);

    if (!isLoggedIn) {
      ctx.patchState({
        questions: [],
      });
      return;
    }

    let myQuestionsPage = ctx.getState().myQuestionsPage;
    if (myQuestionsPage === undefined) {
      myQuestionsPage = 1;
      ctx.patchState({myQuestionsPage: 1});
    }
    let count = 0;

    const parameters = action.answered ? { page: myQuestionsPage, answered: action.answered} : { page: myQuestionsPage };

    const route = action.onlyDownVoted ? BackendRoutes.DownvotedQuestions : BackendRoutes.MyQuestions;

    return this
      .http
      .get(
        urlcat(API_ENDPOINT, route, parameters)
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/dot-notation
        tap(data => { count = data['count']; }),
        map((data: { results: unknown[] }) => data.results.map((item) => this.convertDataIntoQuestionWithTags(item))),
        tap(questions => {
          ctx.patchState({
              myQuestions: questions,
              myQuestionsMaximumPage: count / 20
            }
          );
        }),
      );
  }

  @Action(QuestionActions.LoadNextMyQuestionsPage)
  public loadNextMyQuestionPage(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.LoadNextMyQuestionsPage
  ) {
    const currentPage = ctx.getState().myQuestionsPage;
    ctx.patchState({
      myQuestionsPage: currentPage + 1
    });
    return ctx.dispatch(new QuestionActions.GetMyQuestionsAction(action.answered));
  }

  @Action(QuestionActions.LoadPreviousMyQuestionsPage)
  public loadPreviousMyQuestionsPage(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.LoadPreviousMyQuestionsPage
  ) {
    const currentPage = ctx.getState().myQuestionsPage;
    if (currentPage === 1) {
      return;
    }
    ctx.patchState({
      myQuestionsPage: currentPage - 1
    });
    return ctx.dispatch(new QuestionActions.GetMyQuestionsAction(action.answered));
  }

  @Action(QuestionActions.LoadNextSearchPage)
  public loadNextPage(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    const currentPage = ctx.getState().searchPage;
    ctx.patchState({
      searchPage: currentPage + 1
    });
    return ctx.dispatch(new QuestionActions.SearchQuestionsAction());
  }

  @Action(QuestionActions.LoadPreviousSearchPage)
  public loadPreviousPage(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    const currentPage = ctx.getState().searchPage;
    if (currentPage === 1) {
      return;
    }
    ctx.patchState({
      searchPage: currentPage - 1
    });
    return ctx.dispatch(new QuestionActions.SearchQuestionsAction());
  }

  @Action(QuestionActions.SearchQuestionsAction)
  public searchQuestions(
    ctx: StateContext<QuestionStateInterface>,
  ) {

    const searchText = ctx.getState().searchText;
    const searchPage = ctx.getState().searchPage;
    const searchSort = ctx.getState().sorting ? ctx.getState().sorting : 'newest';
    let count = 0;

    return this
      .http
      .get(
        urlcat(API_ENDPOINT, BackendRoutes.Questions, { search: searchText, page: searchPage, ordering: '-' + searchSort }),
      )
      .pipe(
        // eslint-disable-next-line @typescript-eslint/dot-notation
        tap(data => { count = data['count']; }),
        map((data: { results: unknown[] }) => data.results.map((item) => this.convertDataIntoQuestionWithTags(item))),
        tap(questions => {
          ctx.patchState({
            searchQuestions: questions,
            searchMaximumPages: count / 20,
          });
        }),
      );
  }

  @Action(QuestionActions.SetSearchText)
  public setSearchText(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.SetSearchText,
  ) {
    ctx.patchState({
      searchText: action.text,
      searchPage: 1
    });
  }

  @Action(QuestionActions.SetSorting)
  public setSorting(
    ctx: StateContext<QuestionStateInterface>,
    action: QuestionActions.SetSorting,
  ) {
    ctx.patchState({
      sorting: action.sorting
    });
    ctx.dispatch(new QuestionActions.SearchQuestionsAction());
  }

  @Action(QuestionActions.GetAllAnsweredQuestionsAction)
  public getAllAnsweredQuestions(
    ctx: StateContext<QuestionStateInterface>,
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
      searchPage: 1,
      searchMaximumPages: 1
    });
  }

  @Action(QuestionActions.ResetMyQuestionsAction)
  public resetMyQuestions(
    ctx: StateContext<QuestionStateInterface>,
  ) {
    ctx.patchState({
      myQuestions: [],
      myQuestionsPage: 1,
      myQuestionsMaximumPage: 1
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
    // eslint-disable-next-line @typescript-eslint/dot-notation
    question.timeCreated = new Date(data['time_created']);

    return question;
  }

}
