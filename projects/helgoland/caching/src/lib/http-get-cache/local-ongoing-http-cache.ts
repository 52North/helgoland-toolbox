import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class LocalOngoingHttpCache {
  private cache: { [key: string]: { request: Observable<HttpEvent<any>> } } =
    {};

  has(req: HttpRequest<any>): boolean {
    return this.cache[req.urlWithParams] !== undefined;
  }

  set(req: HttpRequest<any>, request: Observable<HttpEvent<any>>): void {
    this.cache[req.urlWithParams] = {
      request,
    };
  }

  observe(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.cache[req.urlWithParams].request;
  }

  clear(req: HttpRequest<any>) {
    delete this.cache[req.urlWithParams];
  }
}
