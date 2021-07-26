import { Expose } from 'class-transformer';

export class TagModel {
  @Expose()
  public id: number;

  @Expose()
  public text: string;
}
