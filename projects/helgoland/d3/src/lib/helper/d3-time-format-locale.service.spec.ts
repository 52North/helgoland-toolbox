import { inject, TestBed } from '@angular/core/testing';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3TimeFormatLocaleService } from './d3-time-format-locale.service';

describe('D3TimeFormatLocaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateTestingModule],
      providers: [
        D3TimeFormatLocaleService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should be created', inject(
    [D3TimeFormatLocaleService],
    (service: D3TimeFormatLocaleService) => {
      expect(service).toBeTruthy();
    },
  ));
});
