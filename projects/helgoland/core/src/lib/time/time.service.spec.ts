import { inject, TestBed } from '@angular/core/testing';

import { LocalStorage } from '../local-storage/local-storage.service';
import { Time } from './time.service';

describe('Time', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Time, LocalStorage]
        });
    });

    it('should be created', inject([Time], (service: Time) => {
        expect(service).toBeTruthy();
    }));

});
