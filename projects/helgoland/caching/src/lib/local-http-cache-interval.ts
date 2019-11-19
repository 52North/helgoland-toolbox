import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCacheInterval } from './model';
import { Timespan, TimeValueTuple, Data } from '@helgoland/core';
import * as lodash from 'lodash';

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

    /**
     * Get all objects cached with a given key (url).
     * @param url
     */
    public get(url: string): CachedObject[] {
        const objs = this.cache.get(url);
        if (objs) {
            const filteredObjs = objs.filter(el => {
                return (new Date() < el.expirationDate);
            });
            this.cache.set(url, filteredObjs);
            return filteredObjs;
        } else {
            return objs;
        }
    }

    /**
     * Get all objects intersecting with a given timespan.
     * Further return all timespans that are not covered.
     * @param url
     * @param timespan
     */
    public getIntersection(url: string, timespan: Timespan): CachedIntersection | null {
        const objs = this.get(url);
        if (objs && objs.length > 0) {
            return this.identifyCachedIntersection(objs, timespan);
        }
        return null;
    }

    /**
     * Cache a new object under a given key (url).
     * @param url
     * @param obj
     */
    public put(url: string, obj: CachedObject, originReq?: boolean) {
        if (this.cache.has(url)) {
            // add new obj to current key
            let cachedObjs = this.cache.get(url);
            const cachedObjsManip: CachedObject[] = [];
            if (originReq) {
                // update timespan boundaries with incoming forceUpdate or origin request
                const objTs = new Timespan(obj.values.values[0][0], obj.values.values[obj.values.values.length - 1][0]);
                // filter cachedObjs without any intersection
                cachedObjs.forEach(el => {
                    // const elTs = new Timespan(el.values.values[0][0], el.values.values[el.values.values.length - 1][0]);
                    const elTs = new Timespan(el.requestTs.from, el.requestTs.to);
                    if (elTs.from > objTs.to) {
                        // el right of obj
                        cachedObjsManip.push(el);
                    } else if (elTs.to < objTs.from) {
                        // el left of obj
                        cachedObjsManip.push(el);
                    } else if (elTs.from > objTs.from && elTs.to >= objTs.to) {
                        // el partly right of obj
                        el.values.values = el.values.values.filter(val => val[0] > objTs.to);
                        el.requestTs = new Timespan(objTs.to + 1, el.requestTs.to);
                        cachedObjsManip.push(el);
                    } else if (elTs.from <= objTs.from && elTs.to < objTs.to) {
                        // el partly left of obj
                        el.values.values = el.values.values.filter(val => val[0] < objTs.from);
                        el.requestTs = new Timespan(el.requestTs.from, objTs.from - 1);
                        cachedObjsManip.push(el);
                    } else if (elTs.from <= objTs.from && elTs.to >= objTs.to) {
                        // el over obj # do partly right and partly left
                        const elLeft = lodash.cloneDeep(el);
                        elLeft.values.values = elLeft.values.values.filter(val => val[0] < objTs.from);
                        el.requestTs = new Timespan(el.requestTs.from, objTs.from - 1);
                        cachedObjsManip.push(elLeft);
                        el.values.values = el.values.values.filter(val => val[0] > objTs.to);
                        el.requestTs = new Timespan(objTs.to + 1, el.requestTs.to);
                        cachedObjsManip.push(el);
                    }
                });
                cachedObjs = cachedObjsManip;
            }
            cachedObjs.push(obj);
            // sort by timespan
            // const objsSorted = cachedObjs.sort((a, b) => (a.values.values[0][0] > b.values.values[0][0]) ? 1 : ((b.values.values[0][0] > a.values.values[0][0]) ? -1 : 0));
            const objsSorted = cachedObjs.sort((a, b) => (a.requestTs.from > b.requestTs.from) ? 1 : ((b.requestTs.from > a.requestTs.from) ? -1 : 0));
            this.cache.set(url, objsSorted);
        } else {
            // set new key containing obj
            this.cache.set(url, [obj]);
        }
    }

    /**
     * Remove every entry in cache.
     */
    public clearCache() {
        this.cache.clear();
    }

    /**
     * Identify relevant objects inside cache and return timespans that are not covered with data
     * @param objs
     * @param ts
     */
    private identifyCachedIntersection(objs: CachedObject[], ts: Timespan): CachedIntersection | null {
        const intersectedObjs = [];
        const differedIntervals = [];

        for (let i = 0; i < objs.length; i++) { // const el of objs) {
            const el = objs[i];
            if (el) {
                const cachedTs = new Timespan(el.requestTs.from, el.requestTs.to);
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
                        const intVals = this.getCachedInterval(el, null, ts, 'inside');
                        if (intVals.values.values.length > 0) {
                            intersectedObjs.push(intVals);
                        }
                    } else {
                        lastLeftRight = true;
                        const diffTs = new Timespan(ts.from, Math.min(ts.to, cachedTs.from) - 1);
                        differedIntervals.push(diffTs);
                        const intVals = this.getCachedInterval(el, diffTs, ts, 'left');
                        if (intVals.values.values.length > 0) {
                            intersectedObjs.push(intVals);
                        }
                    }
                }
                let pushedInside = false;
                // d) checked timespan ends on ending or after cached timespan
                // right difference exists - check for last element only
                if (ts.to >= cachedTs.to && i >= objs.length - 1) {
                    if (ts.to === cachedTs.to) {
                        if (ts.from !== cachedTs.from) {
                            pushedInside = true;
                            const intVals = this.getCachedInterval(el, null, ts, 'inside');
                            if (intVals.values.values.length > 0) {
                                intersectedObjs.push(intVals);
                            }
                        }
                    } else {
                        const diffTs = new Timespan(Math.max(ts.from, cachedTs.to) + 1, ts.to);
                        differedIntervals.push(diffTs);
                        if (!lastLeftRight) {
                            const intVals = this.getCachedInterval(el, diffTs, ts, 'right');
                            if (intVals.values.values.length > 0) {
                                intersectedObjs.push(intVals);
                            }
                            return {
                                cachedObjects: intersectedObjs,
                                timespans: differedIntervals
                            };
                        }
                    }
                }
                // e) checked timespan is completely inside or half inside cached item
                if (cachedTs.from < ts.from && ts.from <= cachedTs.to) {
                    if (!pushedInside) {
                        const intVals = this.getCachedInterval(el, null, ts, 'inside');
                        if (intVals.values.values.length > 0) {
                            intersectedObjs.push(intVals);
                        }
                    }
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

    /**
     * Function to filter cached values by given timespan.
     * @param obj {CachedObject} cached object with values
     * @param tsDiff {Timespan} updated timespan for different cached objects and time periods
     * @param ts {Timespan} requested timespan
     * @param pos {string} indicates point in time where values should be taken from
     */
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
        // # TODO: check referenceValues
        return clonedObj;
    }
}
