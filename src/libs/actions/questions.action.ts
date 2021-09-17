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

    public constructor(
      public onlyDownVoted: boolean=false,
      public answered: boolean=false,
    ) {}
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

  export class SetSearchText {
    public static readonly type = '[Questions] Set text for search';

    public constructor(
      public text: string,
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

  export class ResetMyQuestionsAction {
    public static readonly type = '[Questions] Reset My Questions';
  }

  export class LoadNextSearchPage {
    public static readonly type ='[Questions] Load next search page';
  }

  export class LoadPreviousSearchPage {
    public static readonly type ='[Questions] Load previous search page';
  }

  export class LoadNextMyQuestionsPage {
    public static readonly type ='[Questions] Load next my question page';

    public constructor(
      public answered: boolean=false,
    ) {}
  }

  export class LoadPreviousMyQuestionsPage {
    public static readonly type ='[Questions] Load previous my question page';

    public constructor(
      public answered: boolean=false,
    ) {}
  }

  export class SetSorting {
    public static readonly type = '[Users] Set the sorting method';

    public constructor(
      public sorting: string,
    ) {}
  }
}
