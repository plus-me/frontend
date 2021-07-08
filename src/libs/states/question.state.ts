import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { QuestionActions } from '../actions/questions.action';
import urlcat from 'urlcat';
import { API_ENDPOINT } from 'src/app/app.config';
import { BackendRoutes } from '../enums/backend-routes.enum';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';
import { QuestionModel } from '../models/question.model';

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
