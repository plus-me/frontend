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
import {API_ENDPOINT} from '../../app/app.config';
import {Storage} from "@ionic/storage";

/*
 * User service provider
*/

@Injectable()
export class UserServiceProvider {

  public static readonly TOKEN_KEY = 'localUserToken';
  public static readonly EMAIL_KEY = 'localUserEmail';

  public constructor(
    public http: HttpClient,
    public storage: Storage,
  ) { }


  public async getToken() {
    const token = await this.storage.get(UserServiceProvider.TOKEN_KEY);

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
      .post<{ token: string, email: string }>(
        `${API_ENDPOINT}/Users/`,
        JSON.stringify({
          email: email,
          password: password,
          username: username
        }),
      )
      .pipe(
        tap((data) => {
          this.storage.set(UserServiceProvider.TOKEN_KEY, data.token);
          this.storage.set(UserServiceProvider.EMAIL_KEY, data.email);
        })
      );
  }

  public forgotPW(email: string) {
    return this.http.post(API_ENDPOINT + '/Users/reset_password/', { email });
  }

}
