import { TagModel } from '@plusme/libs/models/tag.model';
import { QuestionModel } from '@plusme/libs/models/question.model';

export namespace QuestionActions {
  export class CreateQuestionAction {
    public static readonly type = '[Questions] Create Question';

    public constructor(
      public text: string,
      public tags: TagModel[],
    ) {}
  }

  export class GetRandomQuestionAction {
    public static readonly type = '[Questions] Get Random Question';
  }

  export class GetMyQuestionsAction {
    public static readonly type = '[Questions] Get My Question';
  }

  export class GetAllAnsweredQuestionsAction {
    public static readonly type = '[Questions] Get All Answered Questions';
  }

  export class GetQuestionsByTagAction {
    public static readonly type = '[Questions] Get Question by tagId';

    public constructor(
      public tag: TagModel,
    ) {}

  }

  export class SortBy {
    public static readonly type = '[Questions] Sort by votes, date, following';

    public constructor(
      public searchMode: string,
    ) {}
  }

  export class GetQuestion {
    public static readonly type = '[Questions] Get Question';

    public constructor(
      public questionId: number,
    ) {}
  }

  export class ReportQuestion {
    public static readonly type = '[Questions] Report a Question';

    public constructor(
      public questionId: number,
      public reason: string,
    ) {}
  }
  export class SearchQuestionsAction {
    public static readonly type = '[Questions] Search Question';

    public constructor(
      public searchText: string,
    ) {}
  }

  export class UpvoteQuestionAction {
    public static readonly type = '[Questions] Upvote Question';

    public constructor(
      public question: QuestionModel,
    ) {}
  }

  export class DownvoteQuestionAction {
    public static readonly type = '[Questions] Downvote Question';

    public constructor(
      public question: QuestionModel,
    ) {}
  }

  export class ResetSearchQuestionsAction {
    public static readonly type = '[Questions] Reset Search Questions';
  }

}
