import { Expose } from 'class-transformer';

export class PartyModel {
  @Expose()
  public id: number;
  @Expose()
  public short_name: string;
  @Expose()
  public name: string;
}

export class AnswerModel {
  @Expose()
  public id: number;
  @Expose()
  public text: string;
  @Expose()
  public votes: number;
  @Expose()
  public party: PartyModel;
}
