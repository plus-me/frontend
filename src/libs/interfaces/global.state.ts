import { UserStateInterface } from '@plusme/libs/states/user.state';
import { AnswerModel } from '../models/answer.model';
import { TagModel } from '../models/tag.model';
import { QuestionStateInterface } from '../states/question.state';

export interface GlobalState {
  user: UserStateInterface;
  tags: TagModel[];
  questions: QuestionStateInterface;
  answers: AnswerModel[];
}
