import { Injectable } from '@angular/core';
import { Timespan, HttpServiceInterceptor, HttpRequestOptions, HttpServiceHandler } from '@helgoland/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { share } from 'rxjs/operators';
import { HttpCacheInterval } from './model';
import { CachedObject, CachedIntersection } from './local-http-cache-interval';
import moment from 'moment';

@Injectable()
export class LocalHttpCacheIntervalInterceptor implements HttpServiceInterceptor {

  private expirationAtMs: 3000;

  constructor(
    protected cache: HttpCacheInterval
  ) { }

  public intercept(
    req: HttpRequest<any>, metadata: HttpRequestOptions, next: HttpServiceHandler
  ): Observable<HttpEvent<any>> {

    // handle GET and getData requests only
    if (req.method !== 'GET') {
      return next.handle(req, metadata);
    }
    if (metadata.forceUpdate) {
      return next.handle(req, metadata);
    }
    if (!req.url.includes('/getData')) {
      return next.handle(req, metadata);
    }

    const reqTimespan = this.decodeTimespan(req.params.get('timespan'));
    const requestTime = new Date();
    // check inside cache
    const intersectedCache = this.cache.getIntersection(req.url, reqTimespan);

    if (intersectedCache && !intersectedCache.timespans) {
      // requested timespan is covered by existing cachedObject
      return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
        observer.next(intersectedCache.cachedObjects[0].httpEvent);
        observer.complete();
      });
    } else {
      // requested timespan is not or not fully covered by existing cachedObjects



      // adapt request if necessary
      // # TODO manipulate timespan of request and eventually create two requests
      let customReq = req.clone({});
      const reqOptions = [];

      if (intersectedCache && intersectedCache.timespans) {
        // customize request, if requested timespan is not fully covered by existing cachedObjects

        if (intersectedCache.timespans.length < 2) {
          customReq = this.updateRequest(customReq);
          reqOptions.push([new Timespan(1, 2), null]);

          console.log('test - only if timespans.length < 2');
          console.log(customReq.params.get('timespan'));
          console.log(metadata);

          customReq.params.set('timespan', this.createRequestTimespan(intersectedCache.timespans[0]));
          console.log(customReq);
          console.log(customReq.params.get('timespan'));
        }

      }


      // use origin request for not covereed timespans
      // or use custom request for not fully covered timespans
      return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
        const shared = next.handle(customReq, metadata).pipe(share());
        shared.subscribe((res) => {
          if (res instanceof HttpResponse) {

            console.log('\nResult');
            console.log(req);
            console.log(res);

            const resultUrl = this.getUrlWithoutParams(res.url);

            // for ts data
            const cachedItem: CachedObject = {
              values: res.body,
              requestTime: requestTime,
              expirationAtMs: this.expirationAtMs,
              httpEvent: res
            };
            // update cache
            this.cache.put(resultUrl, cachedItem);

            observer.next(res);
            observer.complete();
          }

        }, (error) => {
          observer.error(error);
          observer.complete();
        });
      });
    }

  }

  // Update request parameter (url) or create new request
  private updateRequest(req: HttpRequest<any>): HttpRequest<any> {
    const customReq = req.clone({});

    return customReq;
  }

  private getUrlWithoutParams(url: string): string {
    const end = url.indexOf('?');
    return url.substring(0, end);
  }

  private decodeTimespan(ts: string): Timespan {
    const idx = ts.indexOf('/');
    const start = ts.substring(0, idx);
    const end = ts.substring(idx + 1);
    return new Timespan(moment(new Date(start)).unix() * 1000, moment(new Date(end)).unix() * 1000);
  }

  private createRequestTimespan(timespan: Timespan): string {
    return encodeURIComponent(moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }
}
