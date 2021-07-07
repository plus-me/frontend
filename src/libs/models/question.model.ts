import { TagModel } from 'src/models/tag.model';

export class QuestionModel {
  public id: number;
  public text: string;
  public tags: TagModel[] = [];
}
