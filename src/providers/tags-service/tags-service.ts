import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {API_ENDPOINT} from '../../app/app.config';
import {
  plainToClass,
} from 'class-transformer';
import { TagModel } from '../../libs/models/tag.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TagsServiceProvider {

  public constructor(public http: HttpClient) {}

  public loadAllTags() {
    return this
      .http
      .get<unknown[]>(API_ENDPOINT + '/Tags/')
      .pipe(
        map(data => plainToClass(TagModel, data, {
            excludeExtraneousValues: true,
          }))
      );
  }

}
