import { AnswerModel } from '@plusme/libs/models/answer.model';
import { QuestionModel } from '@plusme/libs/models/question.model';

export namespace AnswerActions {
  export class GetAnswersAction {
    public static readonly type = '[Answers] Get Answers to a Question';

    public constructor(
      public questionId: number,
    ) {}
  }

  export class UpvoteAnswerAction {
    public static readonly type = '[Answers] Upvote Answer';

    public constructor(
      public answer: AnswerModel,
    ) {}
  }

  export class DownvoteAnswerAction {
    public static readonly type = '[Answers] Downvote Answer';

    public constructor(
      public answer: AnswerModel,
    ) {}
  }

}
