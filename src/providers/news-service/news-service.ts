import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import {API_ENDPOINT} from '@plusme/app/app.config';
import {
  zip,
  from,
} from 'rxjs';


@Injectable()
export class NewsServiceProvider {

  public constructor(
    private http: HttpClient,
    private storage: Storage,
  ) {}

  unseenNews() {
    return zip(
      from(this.storage.get('seenNews')),
      this.loadNews(),
      (seenNews: number[], news) =>
        news.reduce((res, e) => {
          if (seenNews == null || !seenNews.includes(e.id)) {
            res++;
          }
          return res;
        }, 0)
    );
  }

  updateSeenNews(ids: number[]) {
    this.storage.set('seenNews', ids);
  }

  loadNews(params: string = '?ordering=-time_created') {
    return this.http.get<Array<{ id: number }>>(API_ENDPOINT + '/News/' + params);
  }

}
