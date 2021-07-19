import { TagModel } from '@plusme/libs/models/tag.model';

export class QuestionModel {
  public id: number;
  public text: string;
  public tags: TagModel[] = [];
}
