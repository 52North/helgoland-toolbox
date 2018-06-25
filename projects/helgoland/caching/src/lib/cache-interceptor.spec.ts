import { inject, TestBed } from '@angular/core/testing';

import { CachingInterceptor } from './cache-interceptor';
import { HttpCache, OnGoingHttpCache } from './model';

describe('CachingInterceptor', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                CachingInterceptor,
                HttpCache,
                OnGoingHttpCache
            ]
        });
    });

    it('should be created', inject([CachingInterceptor], (service: CachingInterceptor) => {
        expect(service).toBeTruthy();
    }));

});
