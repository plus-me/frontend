import { Expose, Transform, Type } from 'class-transformer';

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
  @Type(() => PartyModel)
  public party: PartyModel;

  @Expose()
  @Transform(({ value }) => value === true ? 'upvote' : value === false ? 'downvote' : undefined , { toClassOnly: true })
  public voted?: 'upvote' | 'downvote';
}
