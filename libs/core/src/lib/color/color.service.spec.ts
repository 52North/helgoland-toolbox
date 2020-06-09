import { inject, TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorService]
        });
    });

    it('should be created', inject([ColorService], (service: ColorService) => {
        expect(service).toBeTruthy();
    }));

    it('get color', inject([ColorService], (service: ColorService) => {
        expect(service.getColor()).toMatch(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    }));
});
