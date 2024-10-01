import { inject, TestBed } from '@angular/core/testing';

import { D3TimeFormatLocaleService } from './d3-time-format-locale.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';

describe('D3TimeFormatLocaleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateTestingModule],
      providers: [D3TimeFormatLocaleService],
    });
  });

  it('should be created', inject(
    [D3TimeFormatLocaleService],
    (service: D3TimeFormatLocaleService) => {
      expect(service).toBeTruthy();
    },
  ));
});
