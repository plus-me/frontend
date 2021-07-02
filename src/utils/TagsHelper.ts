import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import { TagsServiceProvider } from '../providers/tags-service/tags-service';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  switchMap,
  tap,
  map,
} from 'rxjs/operators';
import {
  of,
} from 'rxjs';
import { TagModel } from 'src/models/tag.model';

@Injectable()
export class TagsHelper {

  public allTagObjects: TagModel[] = [];
  public messageConnectionError = '';

  constructor(
    public storage: Storage,
    public tagsService: TagsServiceProvider,
    public toastCtrl: ToastController,
    public translate: TranslateService,
  ) {
    translate.get('CONNERROR', { value: 'world' }).subscribe((res: string) => {
      this.messageConnectionError = res;
    });
  }

  //GET all possible tags from server & store in local storage
  public loadAllTagObjects() {
    return this
      .tagsService
      .loadAllTags()
      .pipe(
        tap((tags) => {
          if (Array.isArray(tags)) {
            this.storage.set('allTags', tags);
            this.allTagObjects = tags;
          }
        })
      );
  }

  public getAllTagObjects() {
    return of(this.allTagObjects)
      .pipe(
        switchMap((tags) => {
          if (Array.isArray(tags) && tags.length > 0) {
            return of(tags);
          }

          return this
            .loadAllTagObjects()
            .pipe(
              tap(async (innerTags) => {
                if (!Array.isArray(innerTags) || innerTags.length === 0) {
                  const toast = await this.toastCtrl.create({
                    message: this.messageConnectionError,
                    duration: 3000
                  });
                  await toast.present();
                } else {
                  this.allTagObjects = innerTags;
                }
              }),
            );
        })
      );
  }

  //Get tag objects by id
  getTagObjects(tagIds: number[]) {
    return this
      .getAllTagObjects()
      .pipe(
        map(tags => tags.filter(tag => tagIds.includes(tag.id))),
      );
  }

  getAllTagObjectsSorted() {
    return this
      .getAllTagObjects()
      .pipe(
        map(tags => {
          tags.sort((a, b) => {
            const tagA = a.text.toUpperCase(); // ignore upper and lowercase
            const tagB = b.text.toUpperCase(); // ignore upper and lowercase
            if (tagA < tagB) {
              return -1;
            }
            if (tagA > tagB) {
              return 1;
            }
            return 0;
          });

          return tags;
        })
      );
  }

}
