import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Interceptor for authentication
 */
@Injectable()
export class AppInterceptor implements HttpInterceptor {

  public constructor(
    private userService: UserServiceProvider,
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
    if (req.url.startsWith('./assets/lang/')) {
      return next.handle(req);
    }

    return from(this.userService.getToken())
      .pipe(
        map((token) => {
          if (typeof token === 'string') {
            return req
              .clone({
                setHeaders: {
                  authorization: token,
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
