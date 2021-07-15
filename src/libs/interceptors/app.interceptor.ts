import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { of, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { GlobalState } from '@plusme/libs/interfaces/global.state';

/**
 * Interceptor for authentication
 */
@Injectable()
export class AppInterceptor implements HttpInterceptor {

  public constructor(
    private store: Store,
  ) { }

  /**
   * Add authentication token to every request
   *
   * @param req http request
   * @param next http handler
   */
  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.url.startsWith('./assets')) {
      return next.handle(req);
    }

    return of(
      this
        .store
        .selectSnapshot((state: GlobalState) => state.user.token))
      .pipe(
        map((token) => {
          if (typeof token === 'string') {
            return req
              .clone({
                setHeaders: {
                  authorization: `Token ${token}`,
                },
              });
          } else {
            return req;
          }
        }),
        switchMap(switchReq => next.handle(switchReq))
      );
  }
}
