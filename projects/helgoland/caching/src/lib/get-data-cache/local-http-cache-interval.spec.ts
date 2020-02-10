import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { DefinedTimespan, DefinedTimespanService, Timespan } from '@helgoland/core';
import moment from 'moment';

import { HelgolandCachingModule } from '../caching.module';
import { CachedIntersection, CachedObject, LocalHttpCacheInterval } from './local-http-cache-interval';

describe('LocalHttpCacheInterval', () => {
    let defTsSrvc: DefinedTimespanService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HelgolandCachingModule
            ],
            providers: [
                LocalHttpCacheInterval,
                DefinedTimespanService
            ]
        });
        defTsSrvc = TestBed.get(DefinedTimespanService);
    });

    it('should be created', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        expect(service).toBeTruthy();
    }));

    it('should cache', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const generalize = false;
        const url = 'uniqueID';
        const el: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan.from, 1],
                    [currTimespan.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespan.from, currTimespan.to),
            httpResponse: new HttpResponse()
        };

        service.clearCache();
        service.put(url, el, generalize);

        expect(service.get(url, generalize)).toBeTruthy();
        expect(service.get(url, generalize)).toBeDefined();
        expect(service.get(url, generalize)).toContain(el);
        expect(service.get(url, generalize)).toEqual([el]);
    }));

    it('should cache for generalized and not generalized data', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespanToday = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const currTimespanYesterday = defTsSrvc.getInterval(DefinedTimespan.YESTERDAY);
        const url = 'uniqueID';
        const el: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespanToday.from, 1],
                    [currTimespanToday.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespanToday.from, currTimespanToday.to),
            httpResponse: new HttpResponse()
        };
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespanYesterday.from, 1],
                    [currTimespanYesterday.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespanYesterday.from, currTimespanYesterday.to),
            httpResponse: new HttpResponse()
        };

        service.clearCache();
        service.put(url, el, true);

        expect(service.get(url, true)).toBeTruthy();
        expect(service.get(url, true)).toBeDefined();
        expect(service.get(url, true)).toContain(el);
        expect(service.get(url, true)).toEqual([el]);

        expect(service.get(url, false)).not.toBeDefined();
        expect(service.get(url, false)).not.toEqual([el]);

        service.put(url, el2, false);

        expect(service.get(url, false)).toBeTruthy();
        expect(service.get(url, false)).toBeDefined();
        expect(service.get(url, false)).toContain(el2);
        expect(service.get(url, false)).toEqual([el2]);

        expect(service.get(url, true)).toBeDefined();
        expect(service.get(url, true)).not.toEqual([el2]);
        expect(service.get(url, true)).toEqual([el]);
    }));

    it('should cache two objects in correct order (ordered by start time)', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const currTimespan2 = defTsSrvc.getInterval(DefinedTimespan.YESTERDAY);
        const generalize = false;
        const url1 = 'uniqueID1';
        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan1.from, 1],
                    [currTimespan1.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespan1.from, currTimespan1.to),
            httpResponse: new HttpResponse()
        };
        const url2 = 'uniqueID2';
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan2.from, 1],
                    [currTimespan2.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespan2.from, currTimespan2.to),
            httpResponse: new HttpResponse()
        };

        service.clearCache();

        service.put(url2, el2, generalize);
        expect(service.get(url2, generalize)).toBeTruthy();
        expect(service.get(url2, generalize)).toBeDefined();
        expect(service.get(url2, generalize)).toContain(el2);
        expect(service.get(url2, generalize)).toEqual([el2]);

        service.put(url1, el1, generalize);
        service.put(url1, el2, generalize);
        expect(service.get(url1, generalize)).toBeTruthy();
        expect(service.get(url1, generalize)).toBeDefined();
        expect(service.get(url1, generalize)).toContain(el1);
        expect(service.get(url1, generalize)).toContain(el2);
        expect(service.get(url1, generalize)).toEqual([el2, el1]);
    }));

    it('should avoid caching objects with same timespans', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const currTimespan2 = defTsSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
        const generalize = false;
        const url1 = 'uniqueID1';
        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan1.from, 1],
                    [currTimespan1.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespan1.from, currTimespan1.to),
            httpResponse: new HttpResponse()
        };
        const url2 = 'uniqueID2';
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan2.from, 1],
                    [currTimespan2.to, 2]
                ]
            },
            expirationDate: moment(new Date()).add(2, 'hours').toDate(),
            expirationAtMs: 3000,
            requestTs: new Timespan(currTimespan2.from, currTimespan2.to),
            httpResponse: new HttpResponse()
        };

        service.clearCache();

        service.put(url2, el2, generalize);
        expect(service.get(url2, generalize)).toBeTruthy();
        expect(service.get(url2, generalize)).toBeDefined();
        expect(service.get(url2, generalize)).toContain(el2);
        expect(service.get(url2, generalize)).toEqual([el2]);

        service.put(url1, el1, generalize);
        service.put(url1, el2, generalize);
        expect(service.get(url1, generalize)).toBeTruthy();
        expect(service.get(url1, generalize)).toBeDefined();
        expect(service.get(url1, generalize)).not.toContain(el1);
        expect(service.get(url1, generalize)).toContain(el2);
        expect(service.get(url1, generalize)).toEqual([el2]);
        expect(service.get(url1, generalize)).not.toEqual([el2, el1]);
    }));

    it('should get intersection correctly', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const expirationDate = moment(new Date()).add(2, 'hours').toDate();
        const expirationAtMs = 3000;
        const httpEvent = new HttpResponse();
        const generalize = false;
        const url1 = 'uniqueID1';
        const url2 = 'uniqueID2';

        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [100, 1],
                    [150, 2],
                    [200, 3],
                    [250, 4],
                    [300, 5]
                ]
            }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
        };
        const el11: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [301, 1],
                    [325, 2],
                    [350, 3]
                ]
            }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
        };
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [500, 1],
                    [550, 2],
                    [600, 3],
                    [650, 4],
                    [700, 5]
                ]
            }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
        };
        const el21: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [701, 1],
                    [725, 2],
                    [750, 3]
                ]
            },
            expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(701, 750), httpResponse: httpEvent
        };
        const el3: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [900, 1],
                    [950, 2],
                    [1000, 3],
                    [1050, 4],
                    [1100, 5]
                ]
            },
            expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(900, 1100), httpResponse: httpEvent
        };

        // test new Timespan(0, 50)
        const result1: CachedIntersection = {
            cachedObjects: [],
            timespans: [new Timespan(0, 50)]
        };
        // test new Timespan(0, 100)
        const result2: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1]], valueAfterTimespan: [150, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            }],
            timespans: [new Timespan(0, 99)]
        };
        // test new Timespan(1100, 1300)
        const result3: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [1100, 5]], valueBeforeTimespan: [1050, 4]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(900, 1100), httpResponse: httpEvent
            }],
            timespans: [new Timespan(1101, 1300)]
        };
        // test new Timespan(101, 299)
        const result4: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [150, 2],
                        [200, 3],
                        [250, 4]], valueBeforeTimespan: [100, 1], valueAfterTimespan: [300, 5]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            }],
            timespans: []
        };
        // test new Timespan(100, 300)
        const result5: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1],
                        [150, 2],
                        [200, 3],
                        [250, 4],
                        [300, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            }],
            timespans: []
        };
        // test new Timespan(100, 301)
        const result51: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1],
                        [150, 2],
                        [200, 3],
                        [250, 4],
                        [300, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1]], valueAfterTimespan: [325, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            }],
            timespans: []
        };
        // test new Timespan(99, 301)
        const result52: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1],
                        [150, 2],
                        [200, 3],
                        [250, 4],
                        [300, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1]], valueAfterTimespan: [325, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            }],
            timespans: [new Timespan(99, 99)]
        };
        // test new Timespan(550, 650)
        const result6: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [550, 2],
                        [600, 3],
                        [650, 4]], valueBeforeTimespan: [500, 1], valueAfterTimespan: [700, 5]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            }],
            timespans: []
        };
        // test new Timespan(200, 600)
        const result7: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [200, 3],
                        [250, 4],
                        [300, 5]], valueBeforeTimespan: [150, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3]], valueAfterTimespan: [650, 4]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            }],
            timespans: [new Timespan(351, 499)]
        };
        // test new Timespan(200, 800)
        const result8: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [200, 3],
                        [250, 4],
                        [300, 5]], valueBeforeTimespan: [150, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(701, 750), httpResponse: httpEvent
            }],
            timespans: [new Timespan(351, 499), new Timespan(751, 800)]
        };
        // test new Timespan(310, 710)
        const result81: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [325, 2],
                        [350, 3]], valueBeforeTimespan: [301, 1]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1]], valueAfterTimespan: [725, 2]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(701, 750), httpResponse: httpEvent
            }],
            timespans: [new Timespan(351, 499)]
        };
        // test new Timespan(0, 1400)
        const result9: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1],
                        [150, 2],
                        [200, 3],
                        [250, 4],
                        [300, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(701, 750), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [900, 1],
                        [950, 2],
                        [1000, 3],
                        [1050, 4],
                        [1100, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(900, 1100), httpResponse: httpEvent
            }],
            timespans: [new Timespan(0, 99), new Timespan(351, 499), new Timespan(751, 899), new Timespan(1101, 1400)]
        };
        // test new Timespan(300, 950)
        const result10: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [300, 5]], valueBeforeTimespan: [250, 4]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 300), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(301, 350), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(500, 700), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(701, 750), httpResponse: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [900, 1],
                        [950, 2]], valueAfterTimespan: [1000, 3]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(900, 1100), httpResponse: httpEvent
            }],
            timespans: [new Timespan(351, 499), new Timespan(751, 899)]
        };

        const elURL2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [100, 1]
                ]
            }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 100), httpResponse: httpEvent
        };
        const resultURL2: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [100, 1]]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(100, 100), httpResponse: httpEvent
            }],
            timespans: []
        };
        const result11: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [1100, 5]], valueBeforeTimespan: [1050, 4]
                }, expirationDate: expirationDate, expirationAtMs: expirationAtMs, requestTs: new Timespan(900, 1100), httpResponse: httpEvent
            }],
            timespans: []
        };

        service.clearCache();

        service.put(url1, el1, generalize);
        service.put(url1, el11, generalize);
        service.put(url1, el2, generalize);
        service.put(url1, el21, generalize);
        service.put(url1, el3, generalize);
        expect(service.get(url1, generalize)).toBeTruthy();
        expect(service.get(url1, generalize)).toBeDefined();
        expect(service.get(url1 , generalize)).toContain(el1);
        expect(service.get(url1 , generalize)).toContain(el2);
        expect(service.get(url1 , generalize)).toContain(el3);
        expect(service.get(url1 , generalize)).toEqual([el1, el11, el2, el21, el3]);

        service.put(url2, elURL2, generalize);
        expect(service.get(url2, generalize)).toBeTruthy();
        expect(service.get(url2, generalize)).toBeDefined();
        expect(service.get(url2, generalize)).toContain(elURL2);

        expect(service.getIntersection(url2, new Timespan(100, 100), generalize)).toEqual(resultURL2, 'should be: complete intersection with 1 element of 1 timeperiod');
        expect(service.getIntersection(url1, new Timespan(0, 50), generalize)).toEqual(result1, 'should be: outside range');
        expect(service.getIntersection(url1, new Timespan(0, 100), generalize)).toEqual(result2, 'should be: intersection by 1 timeperiod before first cached item');
        expect(service.getIntersection(url1, new Timespan(1100, 1300), generalize)).toEqual(result3, 'should be: intersection by 1 timeperiod after first cached item');
        expect(service.getIntersection(url1, new Timespan(101, 299), generalize)).toEqual(result4, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(100, 300), generalize)).toEqual(result5, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(100, 301), generalize)).toEqual(result51, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(99, 301), generalize)).toEqual(result52,
            'should be: no intersection by 1 timeperiod before first cached item, intersection inbetween two elements');
        expect(service.getIntersection(url1, new Timespan(550, 650), generalize)).toEqual(result6, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(200, 600), generalize)).toEqual(result7, 'should be: intersection inbetween two timeperiods');
        expect(service.getIntersection(url1, new Timespan(200, 800), generalize)).toEqual(result8, 'should be: intersection inbetween four timeperiods');
        expect(service.getIntersection(url1, new Timespan(310, 710), generalize)).toEqual(result81, 'should be: intersection inbetween three timeperiods');
        expect(service.getIntersection(url1, new Timespan(0, 1400), generalize)).toEqual(result9, 'should be: intersection in five timeperiods with outside range');
        expect(service.getIntersection(url1, new Timespan(300, 950), generalize)).toEqual(result10, 'should be: intersection in four timeperiods, endings inside intersection');
        expect(service.getIntersection(url1, new Timespan(1100, 1100), generalize)).toEqual(result11, 'should be: complete intersection with element of 1 timeperiod');
    }));


});
