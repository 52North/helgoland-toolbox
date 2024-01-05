import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestOptions } from '../model/internal/http-requests';

export const HTTP_SERVICE_INTERCEPTORS =
  new InjectionToken<HttpServiceInterceptor>('HTTP_SERVICE_INTERCEPTORS');

export interface HttpServiceHandler {
  handle(
    req: HttpRequest<any>,
    options: Partial<HttpRequestOptions>,
  ): Observable<HttpEvent<any>>;
}

export interface HttpServiceInterceptor {
  intercept(
    req: HttpRequest<any>,
    options: Partial<HttpRequestOptions>,
    next: HttpServiceHandler,
  ): Observable<HttpEvent<any>>;
}

@Injectable()
export class HttpService {
  private handler: HttpServiceHandler;

  constructor(
    protected httpHandler: HttpHandler,
    @Optional()
    @Inject(HTTP_SERVICE_INTERCEPTORS)
    interceptors: HttpServiceInterceptor[] | null,
  ) {
    let handler: HttpServiceHandler = {
      handle: (req, options) => httpHandler.handle(req),
    };
    if (interceptors) {
      handler = interceptors.reduceRight(
        (next, interceptor) => ({
          handle: (req, options) => interceptor.intercept(req, options, next),
        }),
        handler,
      );
    }
    this.handler = handler;
  }

  public client(options: HttpRequestOptions = {}): HttpClient {
    return new HttpClient({
      handle: (req) => this.handler.handle(req, options),
    });
  }
}
