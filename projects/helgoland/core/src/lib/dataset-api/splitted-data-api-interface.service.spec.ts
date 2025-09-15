import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HttpService } from './http.service';
import { InternalIdHandler } from './internal-id-handler.service';
import { SplittedDataDatasetApiInterface } from './splitted-data-api-interface.service';

describe('SplittedDataDatasetApiInterface', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule],
      providers: [
        SplittedDataDatasetApiInterface,
        InternalIdHandler,
        HttpService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should be created', inject(
    [SplittedDataDatasetApiInterface],
    (service: SplittedDataDatasetApiInterface) => {
      expect(service).toBeTruthy();
    },
  ));
});
