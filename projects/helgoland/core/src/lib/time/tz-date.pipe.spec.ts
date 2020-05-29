import { inject, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '../core.module';
import { TzDatePipe } from './tz-date.pipe';
import { TimezoneService } from './timezone.service';

describe('TzDatePipe', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule,
    ]
  }));

  it('create an instance', inject([TimezoneService, TranslateService], (timezoneSrvc: TimezoneService, translateSrvc: TranslateService) => {
    const pipe = new TzDatePipe(timezoneSrvc, translateSrvc);
    expect(pipe).toBeTruthy();
  }));

});
