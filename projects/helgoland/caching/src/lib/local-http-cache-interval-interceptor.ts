import { Injectable } from '@angular/core';
import { Timespan, HttpServiceInterceptor, HttpRequestOptions, HttpServiceHandler, TimeValueTuple, Data } from '@helgoland/core';
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

    console.log('intercept');
    console.log(req.params.get('timespan'));

    const reqTimespan = this.decodeTimespan(req.params.get('timespan'));
    const requestTime = new Date();
    // check cache for existing timespans
    const intersectedCache = this.cache.getIntersection(req.url, reqTimespan);

    if (intersectedCache && intersectedCache.timespans.length === 0) {
      // requested timespan is covered by existing cachedObject
      return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
        console.log('taken from cache');
        const httpResponse = intersectedCache.cachedObjects[0].httpResponse;
        const resHttpEvent = this.createHttpResponse(httpResponse, intersectedCache);
        observer.next(resHttpEvent); // intersectedCache.cachedObjects[0].httpEvent);
        observer.complete();
      });
    } else {
      // requested timespan is not or not fully covered by existing cachedObjects

      // adapt request if necessary
      // # TODO manipulate timespan of request and eventually create two requests
      const customReqs = [];
      const reqOptions = [];

      if (intersectedCache && intersectedCache.timespans.length > 0) {
        // customize request, if requested timespan is not fully covered by existing cachedObjects
        // at least one custom request needed
        intersectedCache.timespans.forEach(ts => {
          let params = req.params;
          params = params.set('timespan', this.createRequestTimespan(ts));
          const cReq = req.clone({ params });
          // cReq.params.set('timespan', this.createRequestTimespan(ts));
          // console.log(cReq.urlWithParams);
          // cReq.urlWithParams = this.updateUrlWithParams(cReq.urlWithParams);
          customReqs.push(cReq);
          const cMetadata = metadata; // # TODO to be adapted
          reqOptions.push(cMetadata);
        });
      }

      // use default req & metadata
      if (customReqs.length === 0) { customReqs.push(req); }
      if (reqOptions.length === 0) { reqOptions.push(metadata); }

      // use origin request for not covered timespans
      // or use custom request for not fully covered timespans
      return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
        const shared = next.handle(customReqs[0], reqOptions[0]).pipe(share());
        shared.subscribe((res) => {
          if (res instanceof HttpResponse) {
            const resultUrl = this.getUrlWithoutParams(res.url);
            // for ts data
            const cachedItem: CachedObject = {
              values: res.body,
              requestTime: requestTime,
              expirationAtMs: this.expirationAtMs,
              httpResponse: res
            };
            if (cachedItem.values.values.length > 0) {
              // update cache
              this.cache.put(resultUrl, cachedItem);
            }
            console.log('taken from cache and response');
            if (intersectedCache && intersectedCache.cachedObjects.length > 0) {
              if (cachedItem.values.values.length > 0) {
                res = this.createHttpResponse(res, intersectedCache, cachedItem);
              } else {
                res = this.createHttpResponse(res, intersectedCache);
              }
            }

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

  /**
   * Concat values of all intersected objects into a http response.
   * @param intersected
   * @param newCachedObject
   */
  private createHttpResponse(httpResponse: HttpResponse<any>, intersected: CachedIntersection, newCachedObject?: CachedObject): HttpEvent<any> {
    const resObj: Data<TimeValueTuple> = intersected.cachedObjects[0].values;
    let newObjValuesTimespan: Timespan;
    if (newCachedObject) {
      // add values of new cached object at the beginning
      newObjValuesTimespan = new Timespan(newCachedObject.values.values[0][0], newCachedObject.values.values[newCachedObject.values.values.length - 1][0]);
      if (newObjValuesTimespan.to <= resObj.values[0][0]) {
        resObj.values = newCachedObject.values.values.concat(resObj.values);
      }
    }
    for (let i = 1; i < intersected.cachedObjects.length; i++) {
      const currVal = intersected.cachedObjects[i].values;
      // add values of new cached object inbetween
      if (newCachedObject && newObjValuesTimespan.from >= resObj.values[resObj.values.length - 1][0] && newObjValuesTimespan.to <= currVal.values[0][0]) {
        resObj.values = resObj.values.concat(newCachedObject.values.values);
      }
      resObj.values = resObj.values.concat(currVal.values);
      // add values of new cached object at the end
      if (i >= intersected.cachedObjects.length - 1 && newCachedObject && newObjValuesTimespan.from >= currVal.values[currVal.values.length - 1][0]) {
        resObj.values = resObj.values.concat(newCachedObject.values.values);
      }

      // # TODO update referenceValues, valuesBeforeTimespan, valuesAfterTimespan
    }

    console.log('HttpResponse manipulated');
    console.log(moment(resObj.values[0][0]).format() + '/' + moment(resObj.values[resObj.values.length - 1][0]).format());
    if (newCachedObject) {
      console.log('new cached object');
      console.log(moment(newCachedObject.values.values[0][0]).format() + '/' + moment(newCachedObject.values.values[newCachedObject.values.values.length - 1][0]).format());
    }

    return new HttpResponse({
      body: resObj,
      headers: httpResponse.headers,
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      url: httpResponse.url
    });
  }

  // Update request parameter (url) or create new request
  private updateHttpRequest(req: HttpRequest<any>): HttpRequest<any> {
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
    // return encodeURIComponent(moment(timespan.from).format() + '/' + moment(timespan.to).format());
    return (moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }
}
