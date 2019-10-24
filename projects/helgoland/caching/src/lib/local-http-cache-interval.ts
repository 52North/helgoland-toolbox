import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCacheInterval } from './model';
import { Timespan, TimeValueTuple, Data } from '@helgoland/core';

export interface CachedObject {
    values: Data<TimeValueTuple>;
    requestTime: Date;
    expirationAtMs: number;
    httpEvent: HttpEvent<any>;
}

export interface CachedIntersection {
    cachedObjects: CachedObject[];
    timespans?: Timespan[];
}

@Injectable()
export class LocalHttpCacheInterval extends HttpCacheInterval {

    private cache: Map<string, CachedObject[]> = new Map();

    /**
     * Get all objects cached with a given key (url).
     * @param url
     */
    public get(url: string): CachedObject[] {
        const objs = this.cache.get(url);
        return objs;
    }

    /**
     * Get all objects intersecting with a given timespan.
     * Further return all timespans that are not covered.
     * @param url
     * @param timespan
     */
    public getIntersection(url: string, timespan: Timespan): CachedIntersection | null {
        const objs = this.cache.get(url);
        if (objs && objs.length > 0) {
            return this.checkTsIntersection(objs, timespan);
        }
        return null;
    }

    /**
     * Cache a new object under a given key (url).
     * @param url
     * @param obj
     */
    public put(url: string, obj: CachedObject) {
        if (this.cache.has(url)) {
            // add new obj to current key
            const newObj = this.cache.get(url);
            newObj.push(obj);
            this.cache.set(url, newObj);
            this.tidyUpCache(url);
        } else {
            // set new key containing obj
            this.cache.set(url, [obj]);
        }
    }

    /**
     * Restructure cache - combine intersecting timespans.
     * @param url
     */
    private tidyUpCache(url: string): void {
        // # TODO restructure whole cache by url
    }

    /**
     * Identify relevant objects inside cache and return timespans that are not covered with data
     * @param objs
     * @param ts
     */
    private checkTsIntersection(objs: CachedObject[], ts: Timespan): CachedIntersection | null {
        // # TODO implement intersection of cached objects
        if (objs) {
            const timespans = null; // or [ts]
            return {
                cachedObjects: objs,
                timespans: timespans
            };
        } else {
            return null;
        }
    }
}
