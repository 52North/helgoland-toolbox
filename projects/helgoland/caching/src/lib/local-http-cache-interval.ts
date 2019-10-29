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
            // # TODO restructure objs / tidyUpCache
            return this.identifyCachedIntersection(objs, timespan);
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
        // # TODO restructure cache by url
    }

    /**
     * Identify relevant objects inside cache and return timespans that are not covered with data
     * @param objs
     * @param ts
     */
    private identifyCachedIntersection(objs: CachedObject[], ts: Timespan): CachedIntersection | null {
        // # TODO implement intersection of cached objects
        // # TODO check expiration of specific timespans

        const intersectedObjs = [];
        const differedIntervals = [];

        for (let i = 0; i < objs.length; i++) { // const el of objs) {
            const el = objs[i];
            if (el) {
                const cachedTs = new Timespan(el.values.values[0][0], el.values.values[el.values.values.length - 1][0]);
                // intersectedIntervals.push(new Timespan(Math.max(cachedTs.from, ts.from), Math.min(cachedTs.to, ts.to)));

                if (cachedTs.from > ts.to) {
                    // not necessary to continue with current cached item
                    differedIntervals.push(ts);
                    // no current cached object existing
                    return {
                        cachedObjects: intersectedObjs,
                        timespans: differedIntervals
                    };
                }
                if (cachedTs.to < ts.from) {
                    if (i < objs.length - 1) {
                        continue;
                    } else {
                        if (differedIntervals.length < 1) {
                            differedIntervals.push(ts);
                        }
                        // no current cached object existing
                        return {
                            cachedObjects: intersectedObjs,
                            timespans: differedIntervals
                        };
                    }
                }

                if (ts.from < cachedTs.from) {
                    // left difference exists
                    const diffTs = new Timespan(ts.from, Math.min(ts.to, cachedTs.from) - 1);
                    differedIntervals.push(diffTs);
                    intersectedObjs.push(this.getCachedInterval(el, diffTs, ts, 'left'));
                }
                if (ts.to > cachedTs.to && i >= objs.length - 1) {
                    // right difference exists - check for last element only
                    const diffTs = new Timespan(Math.max(ts.from, cachedTs.to) + 1, ts.to);
                    differedIntervals.push(diffTs);
                    intersectedObjs.push(this.getCachedInterval(el, diffTs, ts, 'right'));
                }
                // if current cached item is inside or below current cached item
                if (cachedTs.to >= ts.to) {
                    return {
                        cachedObjects: intersectedObjs,
                        timespans: differedIntervals
                    };
                }
                ts.from = Math.min(ts.to, cachedTs.to) + 1; // check if ts is negative now
                if (ts.from >= ts.to) {
                    console.log('negative or equal timestamp');
                    // # TODO: check
                }
            }
        }
        return {
            cachedObjects: intersectedObjs,
            timespans: differedIntervals
        };
    }

    private getCachedInterval(obj: CachedObject, tsDiff: Timespan, ts: Timespan, pos: string): CachedObject {
        if (pos === 'left') {
            obj.values.values = obj.values.values.filter(el => el[0] <= ts.to && el[0] >= tsDiff.to);
        }
        if (pos === 'right') {
            obj.values.values = obj.values.values.filter(el => el[0] >= ts.from  && el[0] <= tsDiff.from);
        }
        // # TODO: check referenceValues of obj.values.###
        return obj;
    }


    // ######################################################################################
    // ######################################################################################
    // ######################################################################################


    private mergeOverlappingIntervals(intervals: Timespan[]) {
    }

    public testGetIntersection(url: string, timespan: Timespan): Timespan[] | null {
        const objs = this.cache.get(url);
        if (objs && objs.length > 0) {
            const intersect = this.testIntersectionAlgorithm(objs, timespan);
            return (intersect.length > 0 ? intersect : null);
        }
        return null;
    }

    private testIntersectionAlgorithm(objs: CachedObject[], ts: Timespan): Timespan[] {
        const differedIntervals = [];

        for (let i = 0; i < objs.length; i++) { // const el of objs) {
            const el = objs[i];
            if (el) {
                const cachedTs = new Timespan(el.values.values[0][0], el.values.values[el.values.values.length - 1][0]);
                if (cachedTs.from > ts.to) {
                    // not necessary to continue with current cached item
                    differedIntervals.push(ts);
                    return differedIntervals;
                }
                if (cachedTs.to < ts.from) {
                    if (i < objs.length - 1) {
                        continue;
                    } else {
                        if (differedIntervals.length < 1) {
                            differedIntervals.push(ts);
                        }
                        return differedIntervals;
                    }
                }
                // intersectedIntervals.push(new Timespan(Math.max(cachedTs.from, ts.from), Math.min(cachedTs.to, ts.to)));
                if (ts.from < cachedTs.from) {
                    // left difference exists
                    differedIntervals.push(new Timespan(ts.from, Math.min(ts.to, cachedTs.from) - 1));
                }
                if (ts.to > cachedTs.to && i >= objs.length - 1) {
                    // right difference exists - check for last element only
                    differedIntervals.push(new Timespan(Math.max(ts.from, cachedTs.to) + 1, ts.to));
                }
                // if current cached item is inside or below current cached item
                if (cachedTs.to >= ts.to) {
                    return differedIntervals;
                }
                ts.from = Math.min(ts.to, cachedTs.to) + 1; // check if ts is negative now
            }
        }
        return differedIntervals;
    }
}
