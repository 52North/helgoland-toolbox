import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCacheInterval } from './model';
import { Timespan, TimeValueTuple, Data } from '@helgoland/core';
import * as lodash from 'lodash';

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
        // # DONE implement intersection of cached objects
        // # TODO check expiration of specific timespans

        const intersectedObjs = [];
        const differedIntervals = [];

        for (let i = 0; i < objs.length; i++) { // const el of objs) {
            const el = objs[i];
            if (el) {
                const cachedTs = new Timespan(el.values.values[0][0], el.values.values[el.values.values.length - 1][0]);
                // intersectedIntervals.push(new Timespan(Math.max(cachedTs.from, ts.from), Math.min(cachedTs.to, ts.to)));

                // a) checked timespan ends before cached timespan
                if (cachedTs.from > ts.to) {
                    differedIntervals.push(ts);
                    return {
                        cachedObjects: intersectedObjs,
                        timespans: differedIntervals
                    };
                }

                // b) checked timespan starts after cached timespan
                if (cachedTs.to < ts.from) {
                    if (i < objs.length - 1) {
                        continue;
                    } else {
                        if (differedIntervals.length < 1) {
                            differedIntervals.push(ts);
                        }
                        return {
                            cachedObjects: intersectedObjs,
                            timespans: differedIntervals
                        };
                    }
                }

                let lastLeftRight = false;

                // c) checked timespan starts before or on cached timespan
                // left difference exists
                if (ts.from <= cachedTs.from) {
                    if (ts.from === cachedTs.from) {
                        intersectedObjs.push(this.getCachedInterval(el, null, ts, 'inside'));
                    } else {
                        lastLeftRight = true;
                        const diffTs = new Timespan(ts.from, Math.min(ts.to, cachedTs.from) - 1);
                        differedIntervals.push(diffTs);
                        intersectedObjs.push(this.getCachedInterval(el, diffTs, ts, 'left'));
                    }
                }

                // d) checked timespan ends on ending or after cached timespan
                // right difference exists - check for last element only
                if (ts.to >= cachedTs.to && i >= objs.length - 1) {
                    if (ts.to === cachedTs.to) {
                        intersectedObjs.push(this.getCachedInterval(el, null, ts, 'inside'));
                    } else {
                        const diffTs = new Timespan(Math.max(ts.from, cachedTs.to) + 1, ts.to);
                        differedIntervals.push(diffTs);
                        if (!lastLeftRight) {
                            intersectedObjs.push(this.getCachedInterval(el, diffTs, ts, 'right'));
                            return {
                                cachedObjects: intersectedObjs,
                                timespans: differedIntervals
                            };
                        }
                    }
                }

                // e) checked timespan is completely inside or half inside cached item
                if (cachedTs.from < ts.from && ts.from <= cachedTs.to) {
                    intersectedObjs.push(this.getCachedInterval(el, null, ts, 'inside'));
                    if (cachedTs.to > ts.to) {
                        // if completely inside cached item
                        return {
                            cachedObjects: intersectedObjs,
                            timespans: differedIntervals
                        };
                    }
                }

                // f) checked timespan ends inside cached item
                if (cachedTs.to >= ts.to) {
                    return {
                        cachedObjects: intersectedObjs,
                        timespans: differedIntervals
                    };
                }

                ts.from = Math.min(ts.to, cachedTs.to) + 1; // check if ts is negative now

                if (ts.from > ts.to) {
                    return {
                        cachedObjects: intersectedObjs,
                        timespans: differedIntervals
                    };
                }
            }
        }
        return {
            cachedObjects: intersectedObjs,
            timespans: differedIntervals
        };
    }

    private getCachedInterval(obj: CachedObject, tsDiff: Timespan, ts: Timespan, pos: string): CachedObject {
        const clonedObj = lodash.cloneDeep(obj);
        if (pos === 'left') {
            clonedObj.values.values = obj.values.values.filter(el => el[0] <= ts.to && el[0] >= tsDiff.to);
        }
        if (pos === 'right') {
            clonedObj.values.values = obj.values.values.filter(el => el[0] >= ts.from && el[0] <= tsDiff.from);
        }
        if (pos === 'inside') {
            clonedObj.values.values = obj.values.values.filter(el => el[0] >= ts.from && el[0] <= ts.to);
        }
        // # TODO: check referenceValues, valueAfterTimespan, valueBeforeTimespan of obj.values.###
        return clonedObj;
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
