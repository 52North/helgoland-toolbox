import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { DatasetApiMapping } from './api-mapping.service';

describe('DatasetApiMapping', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [DatasetApiMapping]
        });
    });

    it('should be created', inject([DatasetApiMapping], (service: DatasetApiMapping) => {
        expect(service).toBeTruthy();
    }));

});
