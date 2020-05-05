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

    it('should resolve internalId as string', inject([InternalIdHandler], (service: InternalIdHandler) => {
        const internalId = service.resolveInternalId('https://www.somewhere.com/api/__123');
        expect(internalId.id).toBe('123');
        expect(internalId.url).toBe('https://www.somewhere.com/api/');
    }));

    it('should resolve internalId as internalId', inject([InternalIdHandler], (service: InternalIdHandler) => {
        const internalId = service.resolveInternalId({
            url: 'https://www.somewhere.com/api/',
            id: '123'
        });
        expect(internalId.id).toBe('123');
        expect(internalId.url).toBe('https://www.somewhere.com/api/');
    }));

});
