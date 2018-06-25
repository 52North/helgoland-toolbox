import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { InternalIdHandler } from './internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from './splitted-data-api-interface.service';

describe('SplittedDataDatasetApiInterface', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: (http: HttpClient) => {
                        return new TranslateHttpLoader(http, './assets/i18n/', '.json');
                    },
                    deps: [HttpClient]
                }
            })],
            providers: [SplittedDataDatasetApiInterface, InternalIdHandler]
        });
    });

    it('should be created', inject([SplittedDataDatasetApiInterface], (service: SplittedDataDatasetApiInterface) => {
        expect(service).toBeTruthy();
    }));

});
