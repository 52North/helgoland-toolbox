import { TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '../core.module';
import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HelgolandCoreModule,
      TranslateTestingModule
    ],
  }));

  it('should be created', () => {
    const service: TimezoneService = TestBed.inject(TimezoneService);
    expect(service).toBeTruthy();
  });

  it('should set timezone', () => {
    const service: TimezoneService = TestBed.inject(TimezoneService);
    const tz = 'America/New_York';
    service.setTimezone(tz);
    expect(service.getTimezoneName()).toBe(tz);
    service.setTimezone();
  });

});
