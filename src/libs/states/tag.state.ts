import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, State, StateContext, Store } from '@ngxs/store';
import { API_ENDPOINT } from 'src/app/app.config';
import { TagModel } from '../models/tag.model';
import { TagsActions } from '../actions/tags.actions';
import { map, tap } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

@State<TagModel[]>({
  name: 'tags',
  defaults: [],
})
@Injectable()
export class TagState {
  public constructor(
    private http: HttpClient,
    private store: Store,
  ) {}

  @Action(TagsActions.RefreshTags)
  public refresh(
    ctx: StateContext<TagModel[]>,
  ) {
    return this
      .http
      .get<unknown[]>(`${API_ENDPOINT}/Tags`)
    .pipe(
      map(data => plainToClass(TagModel, data, {
        excludeExtraneousValues: true,
      })),
      tap((data) => {
        ctx.setState(data);
      }),
    );
  }

  @Action(TagsActions.CreateTag)
  public create(
    _ctx: StateContext<TagModel[]>,
    action: TagsActions.CreateTag,
  ) {
    return this
      .http
    .post(
      `${API_ENDPOINT}/Tags`,
      JSON.stringify({
        text: action.text,
      })
    )
    .pipe(
      tap(() => this.store.dispatch(new TagsActions.RefreshTags())),
    );
  }
}
