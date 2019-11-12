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

  private expirationAtMs = 30000;
  private expanded = false;
  private urlID;

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
    if (!req.url.includes('/getData')) {
      return next.handle(req, metadata);
    }
    if (req.urlWithParams.includes('expanded=true')) {
      this.expanded = true;
      this.urlID = this.decodeID(req.url);
    }

    // adapt request if necessary
    const customReqs = [];
    const reqOptions = [];

    let intersectedCache;

    if (!metadata.forceUpdate) {
      const reqTimespan = this.decodeTimespan(req.params.get('timespan'));
      // check cache for existing timespans
      intersectedCache = this.cache.getIntersection(req.url, reqTimespan);

      if (intersectedCache && intersectedCache.timespans.length === 0) {
        // requested timespan is covered by existing cachedObject
        return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
          const httpResponse = intersectedCache.cachedObjects[0].httpResponse;
          const resHttpEvent = this.createHttpResponse(httpResponse, intersectedCache);
          observer.next(resHttpEvent); // intersectedCache.cachedObjects[0].httpEvent);
          observer.complete();
        });
      } else {
        // requested timespan is not or not fully covered by existing cachedObjects
        if (intersectedCache && intersectedCache.timespans.length > 1) {
          // if more than one not covered timespans need to be requested, use origin request only
          // customReqs.push(req);
          // reqOptions.push(metadata);

          // TODO adapt here to handle more than one customized request, see 2 lines below

        } else if (intersectedCache && intersectedCache.timespans.length > 0) {
          // customize request, if requested timespan is not fully covered by existing cachedObjects
          // currently for one request only
          intersectedCache.timespans.forEach(ts => {
            let params = req.params;
            params = params.set('timespan', this.encodeTimespan(ts));
            const cReq = req.clone({ params });
            customReqs.push(cReq);
            const cMetadata = metadata;
            reqOptions.push(cMetadata);
          });
        }
      }
    }

    let originReq = false;
    // use default req & metadata
    if (customReqs.length === 0) {
      customReqs.push(req);
      originReq = true;
    }
    if (reqOptions.length === 0) { reqOptions.push(metadata); }

    const newRequest = customReqs[0];
    const newOptions = reqOptions[0];

    // use origin request for not covered timespans
    // or use custom request for not fully covered timespans
    return new Observable<HttpEvent<any>>((observer: Observer<HttpEvent<any>>) => {
      const shared = next.handle(newRequest, newOptions).pipe(share());
      shared.subscribe((res) => {
        if (res instanceof HttpResponse) {
          const expirationTime = metadata.expirationAtMs ? metadata.expirationAtMs : this.expirationAtMs;
          const resultUrl = this.getUrlWithoutParams(res.url);
          // for ts data
          const cachedItem: CachedObject = {
            values: !this.expanded ? res.body : res.body[this.urlID],
            expirationDate: moment(moment(new Date())).add(expirationTime, 'milliseconds').toDate(),
            expirationAtMs: expirationTime,
            httpResponse: res,
            requestTs: this.decodeTimespan(newRequest.params.get('timespan'))
          };
          if (cachedItem.values.values.length > 0) {
            // update cache
            this.cache.put(resultUrl, cachedItem, originReq);
          }
          if (!originReq && intersectedCache && intersectedCache.cachedObjects.length > 0) {
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

      // # TODO update referenceValues
    }

    const body = {};
    body[this.urlID] = resObj;
    return new HttpResponse({
      body: !this.expanded ? resObj : body,
      headers: httpResponse.headers,
      status: httpResponse.status,
      statusText: httpResponse.statusText,
      url: httpResponse.url
    });
  }

  /**
   * Function to identify only the url with id without any request parameters.
   * @param url {string} url of a request
   */
  private getUrlWithoutParams(url: string): string {
    const end = url.indexOf('?');
    return url.substring(0, end);
  }

  /**
   * Function to decode a string to a timespan.
   * @param ts {string} timespan as string format
   */
  private decodeTimespan(ts: string): Timespan {
    const idx = ts.indexOf('/');
    const start = ts.substring(0, idx);
    const end = ts.substring(idx + 1);
    return new Timespan(moment(new Date(start)).unix() * 1000, moment(new Date(end)).unix() * 1000);
  }

  /**
   * Function to encode timespan to a string format.
   * @param timespan {Timespan} timespan to be encoded to a string format
   */
  private encodeTimespan(timespan: Timespan): string {
    return (moment(timespan.from).format() + '/' + moment(timespan.to).format());
  }

  private decodeID(url: string): string | number {
    const idx = url.indexOf('/getData');
    const start = url.substring(0, idx);
    const idxID = start.lastIndexOf('/') + 1;
    return start.substring(idxID);
  }
}
