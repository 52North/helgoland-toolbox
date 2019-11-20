import { inject, TestBed } from '@angular/core/testing';

import { LocalOngoingHttpCache } from './local-ongoing-http-cache';

describe('LocalOngoingHttpCache', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LocalOngoingHttpCache]
        });
    });

    it('should be created', inject([LocalOngoingHttpCache], (service: LocalOngoingHttpCache) => {
        expect(service).toBeTruthy();
    }));

});
