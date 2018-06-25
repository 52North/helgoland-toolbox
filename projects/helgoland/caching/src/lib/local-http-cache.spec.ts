import { inject, TestBed } from '@angular/core/testing';

import { LocalHttpCache } from './local-http-cache';

describe('LocalHttpCache', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LocalHttpCache]
        });
    });

    it('should be created', inject([LocalHttpCache], (service: LocalHttpCache) => {
        expect(service).toBeTruthy();
    }));

});
