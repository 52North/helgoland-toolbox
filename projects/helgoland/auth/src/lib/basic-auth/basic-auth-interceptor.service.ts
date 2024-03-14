import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequestOptions,
  HttpServiceHandler,
  HttpServiceInterceptor,
  Settings,
  SettingsService,
} from '@helgoland/core';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';

import { BasicAuthServiceMaintainer } from './basic-auth-service-maintainer.service';
import { BasicAuthService } from './basic-auth.service';

/**
 * Needs to be implemented to do the authentication for the given url.
 */
export abstract class BasicAuthInformer {
  public abstract doBasicAuth(url: string): Observable<boolean>;
}

/**
 * Interceptor to a basic auth token if needed.
 */
@Injectable()
export class BasicAuthInterceptorService implements HttpServiceInterceptor {
  constructor(
    protected settings: SettingsService<Settings>,
    protected basicAuthServices: BasicAuthServiceMaintainer,
    protected basicAuthSrvc: BasicAuthService,
    protected receptor: BasicAuthInformer,
  ) {}

  intercept(
    req: HttpRequest<any>,
    options: Partial<HttpRequestOptions>,
    next: HttpServiceHandler,
  ): Observable<HttpEvent<any>> {
    const url = this.basicAuthServices.getCorrespondingService(req.url);
    if (url) {
      const token = this.basicAuthSrvc.getToken(url);
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: token,
          },
        });
        return next.handle(req, options);
      } else {
        return new Observable<HttpEvent<any>>(
          (observer: Observer<HttpEvent<any>>) => {
            let basicAuthRequest = this.basicAuthSrvc.ongoingRequests.get(url);
            if (!basicAuthRequest) {
              basicAuthRequest = this.receptor.doBasicAuth(url).pipe(share());
              this.basicAuthSrvc.ongoingRequests.set(url, basicAuthRequest);
            }
            basicAuthRequest.subscribe((successfully) => {
              this.basicAuthSrvc.ongoingRequests.delete(url);
              const token = this.basicAuthSrvc.getToken(url);
              if (successfully && token) {
                req = req.clone({
                  setHeaders: {
                    Authorization: token,
                  },
                });
              } else {
                observer.error('Not authenticated.');
                observer.complete();
                return;
              }
              return next.handle(req, options).subscribe({
                next: (res) => {
                  observer.next(res);
                  if (res instanceof HttpResponse) {
                    observer.complete();
                  }
                },
                error: (error) => {
                  observer.error(error);
                  observer.complete();
                },
              });
            });
          },
        );
      }
    } else {
      return next.handle(req, options);
    }
  }
}

export interface BasicAuthCredentials {
  username: string;
  password: string;
}
