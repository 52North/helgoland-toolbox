import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HttpService, Timespan, DefinedTimespanService, DefinedTimespan } from '@helgoland/core';

import { LocalHttpCacheInterval, CachedObject, CachedIntersection } from './local-http-cache-interval';
import { HelgolandCachingModule } from './caching.module';

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
        const url = 'uniqueID';
        const el: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan.from, 1],
                    [currTimespan.to, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        service.put(url, el);

        expect(service.get(url)).toBeTruthy();
        expect(service.get(url)).toBeDefined();
        expect(service.get(url)).toContain(el);
        expect(service.get(url)).toEqual([el]);
    }));

    it('should cache two objects', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        const currTimespan1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        const currTimespan2 = defTsSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
        const url1 = 'uniqueID1';
        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [currTimespan1.from, 1],
                    [currTimespan1.to, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
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
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };

        service.put(url2, el2);
        expect(service.get(url2)).toBeTruthy();
        expect(service.get(url2)).toBeDefined();
        expect(service.get(url2)).toContain(el2);
        expect(service.get(url2)).toEqual([el2]);


        service.put(url1, el1);
        service.put(url1, el2);
        expect(service.get(url1)).toBeTruthy();
        expect(service.get(url1)).toBeDefined();
        expect(service.get(url1)).toContain(el1);
        expect(service.get(url1)).toContain(el2);
        expect(service.get(url1)).toEqual([el1, el2]);
    }));

    it('should get intersection correctly - test cases just for timespans', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        // const ts1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        // const ts2 = defTsSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);
        const url1 = 'uniqueID1';
        const el1: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [100, 1],
                    [300, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        const el11: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [301, 1],
                    [350, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        const el2: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [500, 1],
                    [700, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        const el21: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [701, 1],
                    [750, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };
        const el3: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [900, 1],
                    [1100, 2]
                ]
            },
            requestTime: new Date(),
            expirationAtMs: 3000,
            httpEvent: new HttpResponse()
        };

        service.put(url1, el1);
        service.put(url1, el11);
        service.put(url1, el2);
        service.put(url1, el21);
        service.put(url1, el3);
        expect(service.get(url1)).toBeTruthy();
        expect(service.get(url1)).toBeDefined();
        expect(service.get(url1)).toContain(el1);
        expect(service.get(url1)).toContain(el2);
        expect(service.get(url1)).toContain(el3);
        expect(service.get(url1)).toEqual([el1, el11, el2, el21, el3]);

        expect(service.testGetIntersection(url1, new Timespan(0, 50))).toEqual([new Timespan(0, 50)], 'should be: outside range');
        expect(service.testGetIntersection(url1, new Timespan(0, 100))).toEqual([new Timespan(0, 99)], 'should be: intersection by 1 element before first cached item');
        expect(service.testGetIntersection(url1, new Timespan(1100, 1300))).toEqual([new Timespan(1101, 1300)], 'should be: intersection by 1 element after first cached item');
        expect(service.testGetIntersection(url1, new Timespan(101, 299))).toEqual(null, 'should be: no difference = complete intersection');
        expect(service.testGetIntersection(url1, new Timespan(100, 300))).toEqual(null, 'should be: no difference = complete intersection');
        expect(service.testGetIntersection(url1, new Timespan(550, 650))).toEqual(null, 'should be: no difference = complete intersection');
        expect(service.testGetIntersection(url1, new Timespan(200, 600))).toEqual([new Timespan(351, 499)], 'should be: intersection inbetween two elements');
        expect(service.testGetIntersection(url1, new Timespan(200, 800))).toEqual([new Timespan(351, 499), new Timespan(751, 800)], 'should be: intersection inbetween three elements');
        expect(service.testGetIntersection(url1, new Timespan(0, 1400))).toEqual([new Timespan(0, 99), new Timespan(351, 499), new Timespan(751, 899), new Timespan(1101, 1400)],
            'should be: intersection in three elements with outside range');
    }));

    it('should get intersection correctly', inject([LocalHttpCacheInterval], (service: LocalHttpCacheInterval) => {
        // const ts1 = defTsSrvc.getInterval(DefinedTimespan.TODAY);
        // const ts2 = defTsSrvc.getInterval(DefinedTimespan.TODAY_YESTERDAY);

        const requestDate = new Date();
        const expirationAtMs = 3000;
        const httpEvent = new HttpResponse();


        const url1 = 'uniqueID1';
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
            },
            requestTime: requestDate,
            expirationAtMs: expirationAtMs,
            httpEvent: httpEvent
        };
        const el11: CachedObject = {
            values: {
                referenceValues: {},
                values: [
                    [301, 1],
                    [325, 2],
                    [350, 3]
                ]
            },
            requestTime: requestDate,
            expirationAtMs: expirationAtMs,
            httpEvent: httpEvent
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
            },
            requestTime: requestDate,
            expirationAtMs: expirationAtMs,
            httpEvent: httpEvent
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
            requestTime: requestDate,
            expirationAtMs: expirationAtMs,
            httpEvent: httpEvent
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
            requestTime: requestDate,
            expirationAtMs: expirationAtMs,
            httpEvent: httpEvent
        };

        service.put(url1, el1);
        service.put(url1, el11);
        service.put(url1, el2);
        service.put(url1, el21);
        service.put(url1, el3);
        expect(service.get(url1)).toBeTruthy();
        expect(service.get(url1)).toBeDefined();
        expect(service.get(url1)).toContain(el1);
        expect(service.get(url1)).toContain(el2);
        expect(service.get(url1)).toContain(el3);
        expect(service.get(url1)).toEqual([el1, el11, el2, el21, el3]);

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
                        [100, 1]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            }],
            timespans: [new Timespan(0, 99)]
        };
        // test new Timespan(1100, 1300)
        const result3: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [1100, 5]
                    ]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                        [250, 4]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                        [650, 4]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                        [300, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                        [300, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            }],
            timespans: [new Timespan(351, 499), new Timespan(751, 800)]
        };
        // test new Timespan(310, 710)
        const result81: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [325, 2],
                        [350, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
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
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [900, 1],
                        [950, 2],
                        [1000, 3],
                        [1050, 4],
                        [1100, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            }],
            timespans: [new Timespan(0, 99), new Timespan(351, 499), new Timespan(751, 899), new Timespan(1101, 1400)]
        };
        // test new Timespan(300, 950)
        const result10: CachedIntersection = {
            cachedObjects: [{
                values: {
                    referenceValues: {}, values: [
                        [300, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [301, 1],
                        [325, 2],
                        [350, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [500, 1],
                        [550, 2],
                        [600, 3],
                        [650, 4],
                        [700, 5]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [701, 1],
                        [725, 2],
                        [750, 3]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            },
            {
                values: {
                    referenceValues: {}, values: [
                        [900, 1],
                        [950, 2]]
                }, requestTime: requestDate, expirationAtMs: expirationAtMs, httpEvent: httpEvent
            }],
            timespans: [new Timespan(351, 499), new Timespan(751, 899)]
        };

        expect(service.getIntersection(url1, new Timespan(0, 50))).toEqual(result1, 'should be: outside range');
        expect(service.getIntersection(url1, new Timespan(0, 100))).toEqual(result2, 'should be: intersection by 1 element before first cached item');
        expect(service.getIntersection(url1, new Timespan(1100, 1300))).toEqual(result3, 'should be: intersection by 1 element after first cached item');
        expect(service.getIntersection(url1, new Timespan(101, 299))).toEqual(result4, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(100, 300))).toEqual(result5, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(100, 301))).toEqual(result51, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(99, 301))).toEqual(result52, 'should be: no intersection by 1 element before first cached item, intersection inbetween two elements');
        expect(service.getIntersection(url1, new Timespan(550, 650))).toEqual(result6, 'should be: no difference = complete intersection');
        expect(service.getIntersection(url1, new Timespan(200, 600))).toEqual(result7, 'should be: intersection inbetween two elements');
        expect(service.getIntersection(url1, new Timespan(200, 800))).toEqual(result8, 'should be: intersection inbetween four elements');
        expect(service.getIntersection(url1, new Timespan(310, 710))).toEqual(result81, 'should be: intersection inbetween three elements');
        expect(service.getIntersection(url1, new Timespan(0, 1400))).toEqual(result9, 'should be: intersection in five elements with outside range');
        expect(service.getIntersection(url1, new Timespan(300, 950))).toEqual(result10, 'should be: intersection in four elements, endings inside intersection');
    }));


});
