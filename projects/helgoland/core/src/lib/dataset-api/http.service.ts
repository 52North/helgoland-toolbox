import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, InjectionToken, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpRequestOptions } from '../model/internal/http-requests';

export const HTTP_SERVICE_INTERCEPTORS = new InjectionToken<
  HttpServiceInterceptor[]
>('HTTP_SERVICE_INTERCEPTORS');

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
  protected httpHandler = inject(HttpHandler);

  private handler: HttpServiceHandler;

  constructor() {
    const httpHandler = this.httpHandler;
    const interceptors = inject(HTTP_SERVICE_INTERCEPTORS, { optional: true });

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

  client(options: HttpRequestOptions = {}): HttpClient {
    return new HttpClient({
      handle: (req) => this.handler.handle(req, options),
    });
  }
}
