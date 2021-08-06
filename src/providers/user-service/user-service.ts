import {
  Injectable,
} from '@angular/core';
import {
  HttpHeaders,
  HttpClient,
} from '@angular/common/http';
import {
    BehaviorSubject,
  from, Subject,
} from 'rxjs';
import {
  mergeMap,
  map,
  tap,
} from 'rxjs/operators';
import {API_ENDPOINT} from '@plusme/app/app.config';
import {Storage} from '@ionic/storage';

/*
 * User service provider
*/

@Injectable()
export class UserServiceProvider {

  public static readonly tokenKey = 'localUserToken';
  public static readonly emailKey = 'localUserEmail';

  public constructor(
    public http: HttpClient,
    public storage: Storage,
  ) { }


  public async getToken() {
    const token = await this.storage.get(UserServiceProvider.tokenKey);

    if (typeof token !== 'string') {
      return undefined;
    }

    return token;
  }

  public loadMe() {
    return this
      .http
      .get(`${API_ENDPOINT}/Users/me/`);
  }

  public createNewUser(username: string, email: string, password: string) {
    return this
      .http
      .post<{ token: string; email: string }>(
        `${API_ENDPOINT}/Users/`,
        JSON.stringify({
          email,
          password,
          username
        }),
      )
      .pipe(
        tap((data) => {
          this.storage.set(UserServiceProvider.tokenKey, data.token);
          this.storage.set(UserServiceProvider.emailKey, data.email);
        })
      );
  }

  public forgotPW(email: string) {
    return this.http.post(API_ENDPOINT + '/Users/reset_password/', { email });
  }

}
