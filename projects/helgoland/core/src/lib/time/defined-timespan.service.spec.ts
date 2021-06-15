import { inject, TestBed } from '@angular/core/testing';

import { DefinedTimespanService } from './defined-timespan.service';

describe('DefinedTimespanService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DefinedTimespanService]
        });
    });

    it('should be created', inject([DefinedTimespanService], (service: DefinedTimespanService) => {
        expect(service).toBeTruthy();
    }));

});
