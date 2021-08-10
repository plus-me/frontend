import { UserStateInterface } from '@plusme/libs/states/user.state';
import { TagModel } from '../models/tag.model';
import { QuestionStateInterface } from '../states/question.state';
import { AnswerStateInterface } from '@plusme/libs/states/answer.state';

export interface GlobalState {
  user: UserStateInterface;
  tags: TagModel[];
  questions: QuestionStateInterface;
  answers: AnswerStateInterface;
}
