import { TagModel } from '@plusme/libs/models/tag.model';
import { Expose } from 'class-transformer';
import {QuestionAnswersModel} from '@plusme/libs/models/question-answers.model';

export class QuestionModel {
  @Expose()
  public id: number;
  @Expose()
  public text: string;
  @Expose()
  public upvotes: number;
  @Expose()
  public own: boolean;
  @Expose()
  public answers: QuestionAnswersModel[] = [];
  @Expose()
  public tags: TagModel[] = [];
  @Expose()
  public voted: boolean;
  @Expose()
  public timeCreated: Date;
}
