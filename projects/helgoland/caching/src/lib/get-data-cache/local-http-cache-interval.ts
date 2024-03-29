import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Data, Timespan, TimeValueTuple } from '@helgoland/core';
import * as lodash from 'lodash';

import { HttpCacheInterval } from '../model';

export interface CachedObject {
  values: Data<TimeValueTuple>;
  expirationDate: Date;
  expirationAtMs: number;
  httpResponse: HttpResponse<any>;
  requestTs: Timespan;
}

export interface CachedIntersection {
  cachedObjects: CachedObject[];
  timespans?: Timespan[];
}

@Injectable()
export class LocalHttpCacheInterval extends HttpCacheInterval {
  private cache: Map<string, CachedObject[]> = new Map();
  private generalizedCache: Map<string, CachedObject[]> = new Map();

  /**
   * Get all objects cached with a given key (url).
   * @param url {string} key
   * @param generalize {boolean} indicate if request has parameter generalized true or false to safe to different caches
   */
  public get(url: string, generalize: boolean): CachedObject[] {
    if (generalize) {
      return this.getByCache(this.generalizedCache, url);
    } else {
      return this.getByCache(this.cache, url);
    }
  }

  /**
   * Get all objects from cache.
   * @param selectedCache {Map<string, CachedObject[]>} selected cache (generalized or not generalized)
   * @param url {string} key
   */
  private getByCache(
    selectedCache: Map<string, CachedObject[]>,
    url: string,
  ): CachedObject[] {
    const objs = selectedCache.get(url);
    if (objs) {
      const filteredObjs = objs.filter((el) => {
        return new Date() < el.expirationDate;
      });
      const newCachedObjs = this.tidyUpCache(filteredObjs);
      selectedCache.set(url, newCachedObjs);
      return newCachedObjs;
    } else {
      // @ts-ignore
      return objs;
    }
  }

  /**
   * Get all objects intersecting with a given timespan.
   * Further return all timespans that are not covered.
   * @param url {string} key
   * @param timespan {Timespan} timespan
   * @param generalize {boolean} generalized or not
   */
  public getIntersection(
    url: string,
    timespan: Timespan,
    generalize: boolean,
  ): CachedIntersection | null {
    const objs = this.get(url, generalize);
    if (objs && objs.length > 0) {
      return this.identifyCachedIntersection(objs, timespan);
    }
    return null;
  }

  /**
   * Cache a new object under a given key (url).
   * @param url {string} key
   * @param obj {CachedObject} object to be cached
   * @param generalize {boolean} generalized or not
   * @param originReq {boolean} indicating if original request or manipulated
   */
  public put(
    url: string,
    obj: CachedObject,
    generalize: boolean,
    originReq?: boolean,
  ) {
    if (generalize) {
      this.putByCache(this.generalizedCache, url, obj, originReq);
    } else {
      this.putByCache(this.cache, url, obj, originReq);
    }
  }

  /**
   * Check for intersection before putting a new object into cache.
   * @param selectedCache {Map<string, CachedObject[]>} current cached objects
   * @param url {string} key
   * @param obj {CachedObject} object to be put into cache
   * @param originReq {boolean} indicating if original request or manipulated
   */
  private putByCache(
    selectedCache: Map<string, CachedObject[]>,
    url: string,
    obj: CachedObject,
    originReq?: boolean,
  ) {
    if (selectedCache.has(url)) {
      let cachedObjs = selectedCache.get(url)!;
      // add new obj to current key
      const cachedObjsManip: CachedObject[] = [];
      if (originReq) {
        // update timespan boundaries with incoming forceUpdate or origin request
        const objTs = new Timespan(obj.requestTs.from, obj.requestTs.to);
        // filter cachedObjs without any intersection
        cachedObjs.forEach((el) => {
          const elTs = new Timespan(el.requestTs.from, el.requestTs.to);

          if (elTs.from >= objTs.from && elTs.to <= objTs.to) {
            // do not push cached element into new cache - cached obj completely covered by new element
          } else if (elTs.from > objTs.to) {
            // el right of obj
            cachedObjsManip.push(el);
          } else if (elTs.to < objTs.from) {
            // el left of obj
            cachedObjsManip.push(el);
          } else if (elTs.from > objTs.from && elTs.to >= objTs.to) {
            // el partly right of obj
            el.values.values = el.values.values.filter(
              (val) => val[0] > objTs.to,
            );
            el.requestTs = new Timespan(objTs.to + 1, el.requestTs.to);
            cachedObjsManip.push(el);
          } else if (elTs.from <= objTs.from && elTs.to < objTs.to) {
            // el partly left of obj
            el.values.values = el.values.values.filter(
              (val) => val[0] < objTs.from,
            );
            el.requestTs = new Timespan(el.requestTs.from, objTs.from - 1);
            cachedObjsManip.push(el);
          } else if (elTs.from <= objTs.from && elTs.to >= objTs.to) {
            // el over obj # do partly right and partly left
            const elLeft = lodash.cloneDeep(el);
            elLeft.values.values = elLeft.values.values.filter(
              (val) => val[0] < objTs.from,
            );
            elLeft.requestTs = new Timespan(
              elLeft.requestTs.from,
              objTs.from - 1,
            );
            cachedObjsManip.push(elLeft);
            el.values.values = el.values.values.filter(
              (val) => val[0] > objTs.to,
            );
            el.requestTs = new Timespan(objTs.to + 1, el.requestTs.to);
            cachedObjsManip.push(el);
          }
        });
        cachedObjs = cachedObjsManip;
      }
      cachedObjs.push(obj);
      // sort by timespan
      const objsSorted = cachedObjs.sort((a, b) =>
        a.requestTs.from > b.requestTs.from
          ? 1
          : b.requestTs.from > a.requestTs.from
            ? -1
            : 0,
      );
      selectedCache.set(url, objsSorted);
    } else {
      selectedCache.set(url, [obj]);
    }
  }

  /**
   * Remove every entry in cache.
   */
  public clearCache() {
    this.cache.clear();
    this.generalizedCache.clear();
  }

  /**
   * Identify relevant objects inside cache and return timespans that are not covered with data.
   * @param objs {CachedObject[]} objects to be checked
   * @param ts {Timespan} timespan that might be intersected
   */
  private identifyCachedIntersection(
    objs: CachedObject[],
    ts: Timespan,
  ): CachedIntersection | null {
    const intersectedObjs: CachedObject[] = [];
    const differedIntervals: Timespan[] = [];

    for (let i = 0; i < objs.length; i++) {
      const el = objs[i];
      const cachedTs = new Timespan(el.requestTs.from, el.requestTs.to);

      if (ts.from > cachedTs.to) {
        // ts right of cached # no overlapping
        if (i === objs.length - 1) {
          differedIntervals.push(ts);
        }
        continue;
      } else if (ts.to < cachedTs.from) {
        // ts left of cached # no overlapping
        differedIntervals.push(ts);
        break;
      } else if (ts.from >= cachedTs.from && ts.to <= cachedTs.to) {
        // ts inside cached # cached completely overlaps ts
        const intVals = this.getCachedInterval(el, null, ts, 'inside');
        if (intVals.values.values.length > 0) {
          intersectedObjs.push(intVals);
        }
        break;
      } else if (ts.from > cachedTs.from && ts.to >= cachedTs.to) {
        // ts partly right of cached # ts and cached overlap, ts ends after cached
        const diffTs = new Timespan(Math.max(ts.from, cachedTs.to) + 1, ts.to);
        if (i === objs.length - 1) {
          differedIntervals.push(ts);
        }
        const intVals = this.getCachedInterval(el, diffTs, ts, 'right');
        if (intVals.values.values.length > 0) {
          intersectedObjs.push(intVals);
        }
      } else if (ts.from <= cachedTs.from && ts.to < cachedTs.to) {
        // ts partly left of cached # ts and cached overlap, cached ends after ts
        const diffTs = new Timespan(
          ts.from,
          Math.min(ts.to, cachedTs.from) - 1,
        );
        differedIntervals.push(diffTs);
        const intVals = this.getCachedInterval(el, diffTs, ts, 'left');
        if (intVals.values.values.length > 0) {
          intersectedObjs.push(intVals);
        }
        break;
      } else if (ts.from <= cachedTs.from && ts.to >= cachedTs.to) {
        // ts over cached # ts completely overlaps cached
        let pushedLeft = false;
        // partly left
        if (ts.from < cachedTs.from) {
          const diffTs = new Timespan(
            ts.from,
            Math.min(ts.to, cachedTs.from) - 1,
          );
          differedIntervals.push(diffTs);
          const intVals = this.getCachedInterval(el, diffTs, ts, 'left');
          if (intVals.values.values.length > 0) {
            intersectedObjs.push(intVals);
          }
          pushedLeft = true;
        } else {
          // completely inside
          const intVals = this.getCachedInterval(el, null, ts, 'inside');
          if (intVals.values.values.length > 0) {
            intersectedObjs.push(intVals);
          }
          pushedLeft = true;
        }
        // partly right
        if (i === objs.length - 1) {
          const diffTsRight = new Timespan(
            Math.max(ts.from, cachedTs.to) + 1,
            ts.to,
          );
          differedIntervals.push(diffTsRight);
          if (!pushedLeft) {
            const intValsRight = this.getCachedInterval(
              el,
              diffTsRight,
              ts,
              'right',
            );
            if (intValsRight.values.values.length > 0) {
              intersectedObjs.push(intValsRight);
            }
          }
          break;
        }
      }
      ts.from = Math.min(ts.to, cachedTs.to) + 1;
      // break if ts is negative now
      if (ts.from > ts.to) {
        break;
      }
    }
    return {
      cachedObjects: intersectedObjs,
      timespans: differedIntervals,
    };
  }

  /**
   * Function to filter cached values by given timespan.
   * @param obj {CachedObject} cached object with values
   * @param tsDiff {Timespan} updated timespan for different cached objects and time periods
   * @param ts {Timespan} requested timespan
   * @param pos {string} indicates point in time where values should be taken from
   */
  private getCachedInterval(
    obj: CachedObject,
    tsDiff: Timespan | null,
    ts: Timespan,
    pos: string,
  ): CachedObject {
    const clonedObj: CachedObject = lodash.cloneDeep(obj);
    if (pos === 'left' && tsDiff) {
      clonedObj.values.values = obj.values.values.filter(
        (el) => el[0] <= ts.to && el[0] >= tsDiff.to,
      );
    }
    if (pos === 'right' && tsDiff) {
      clonedObj.values.values = obj.values.values.filter(
        (el) => el[0] >= ts.from && el[0] <= tsDiff.from,
      );
    }
    if (pos === 'inside') {
      clonedObj.values.values = obj.values.values.filter(
        (el) => el[0] >= ts.from && el[0] <= ts.to,
      );
    }
    // set valueBeforeTimespan and valueAfterTimespan, if possible
    if (clonedObj.values.values.length > 0 && obj.values.values.length > 0) {
      const idx = obj.values.values.findIndex(
        (el) => el[0] === clonedObj.values.values[0][0],
      );
      if (idx > 0 && obj.values.values[idx - 1]) {
        clonedObj.values.valueBeforeTimespan = obj.values.values[idx - 1];
      }
      const idxj = obj.values.values.findIndex(
        (el) =>
          el[0] ===
          clonedObj.values.values[clonedObj.values.values.length - 1][0],
      );
      if (idxj >= 0 && obj.values.values[idxj + 1]) {
        clonedObj.values.valueAfterTimespan = obj.values.values[idxj + 1];
      }
    }
    return clonedObj;
  }

  /**
   * Filter cached objects and remove duplicates.
   * @param filteredObjs {CachedObject[]} objects to be filtered
   */
  private tidyUpCache(filteredObjs: CachedObject[]): CachedObject[] {
    // tidy up to avoid duplicate timespans in cache
    for (let i = 0; i < filteredObjs.length - 1; i++) {
      const obj = filteredObjs[i];
      filteredObjs = filteredObjs.filter(
        (el) =>
          !(
            el.requestTs.from >= obj.requestTs.from &&
            el.requestTs.to <= obj.requestTs.to
          ),
      );
      filteredObjs.splice(i, 0, obj);
    }
    return filteredObjs;
  }
}
