import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { InternalIdHandler } from './internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from './splitted-data-api-interface.service';

describe('SplittedDataDatasetApiInterface', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                TranslateTestingModule
            ],
            providers: [
                SplittedDataDatasetApiInterface,
                InternalIdHandler
            ]
        });
    });

    it('should be created', inject([SplittedDataDatasetApiInterface], (service: SplittedDataDatasetApiInterface) => {
        expect(service).toBeTruthy();
    }));

});
