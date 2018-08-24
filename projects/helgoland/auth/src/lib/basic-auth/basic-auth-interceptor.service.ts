import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestOptions, HttpServiceHandler, HttpServiceInterceptor, Settings, SettingsService } from '@helgoland/core';
import { Observable, Observer } from 'rxjs';

import { BasicAuthServicesKeeper } from './basic-auth-services-keeper.service';
import { BasicAuthService } from './basic-auth.service';


@Injectable()
export class BasicAuthInterceptorService implements HttpServiceInterceptor {

  constructor(
    protected settings: SettingsService<Settings>,
    protected basicAuthServices: BasicAuthServicesKeeper,
    protected basicAuthSrvc: BasicAuthService,
    protected receptor: BasicAuthInformer
  ) { }

  intercept(req: HttpRequest<any>, options: Partial<HttpRequestOptions>, next: HttpServiceHandler): Observable<HttpEvent<any>> {
    const url = this.basicAuthServices.getCorrespondingService(req.url);
    if (url) {
      if (this.basicAuthSrvc.hasToken(url)) {
        req = req.clone({
          setHeaders: {
            Authorization: this.basicAuthSrvc.getToken(url)
          }
        });
        return next.handle(req, options);
      } else {
        return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
          this.receptor.doBasicAuth(url).subscribe(successfully => {
            if (successfully) {
              req = req.clone({
                setHeaders: {
                  Authorization: this.basicAuthSrvc.getToken(url)
                }
              });
            }
            next.handle(req, options).subscribe(res => {
              observer.next(res);
              if (res instanceof HttpResponse) {
                observer.complete();
              }
            });
          });
        });
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

export abstract class BasicAuthInformer {
  public abstract doBasicAuth(url: string): Observable<boolean>;
}
