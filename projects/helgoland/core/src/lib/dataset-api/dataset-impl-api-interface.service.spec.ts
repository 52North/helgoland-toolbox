import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { DatasetImplApiInterface } from './dataset-impl-api-interface.service';
import { InternalIdHandler } from './internal-id-handler.service';

describe('DatasetImplApiInterface', () => {
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
            providers: [DatasetImplApiInterface, InternalIdHandler]
        });
    });

    it('should be created', inject([DatasetImplApiInterface], (service: DatasetImplApiInterface) => {
        expect(service).toBeTruthy();
    }));

});
