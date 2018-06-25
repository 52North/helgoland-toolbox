import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { DatasetImplApiInterface } from './dataset-impl-api-interface.service';
import { InternalIdHandler } from './internal-id-handler.service';

describe('DatasetImplApiInterface', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateTestingModule,
            ],
            providers: [
                DatasetImplApiInterface,
                InternalIdHandler
            ]
        });
    });

    it('should be created', inject([DatasetImplApiInterface], (service: DatasetImplApiInterface) => {
        expect(service).toBeTruthy();
    }));

});
