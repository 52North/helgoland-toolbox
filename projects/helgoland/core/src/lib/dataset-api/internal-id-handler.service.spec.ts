import { inject, TestBed } from '@angular/core/testing';

import { InternalIdHandler } from './internal-id-handler.service';

describe('InternalIdHandler', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InternalIdHandler]
        });
    });

    it('should be created', inject([InternalIdHandler], (service: InternalIdHandler) => {
        expect(service).toBeTruthy();
    }));

});
