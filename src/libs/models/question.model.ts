import { TagModel } from '@plusme/libs/models/tag.model';
import { Expose } from 'class-transformer';

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
  public answers: object[];
  @Expose()
  public tags: TagModel[] = [];
}
