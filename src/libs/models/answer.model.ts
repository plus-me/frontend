import { Expose } from 'class-transformer';

export class AnswerModel {
  @Expose()
  public id: number;
  @Expose()
  public text: string;
  @Expose()
  public votes: number;
  @Expose()
  public party: number;
}
