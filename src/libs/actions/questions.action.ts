import { TagModel } from '../../models/tag.model';
import { QuestionModel } from '../models/question.model';

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

}
