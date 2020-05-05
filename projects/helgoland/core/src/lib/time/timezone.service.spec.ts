import { TestBed } from '@angular/core/testing';
import moment from 'moment';

import { TimezoneService } from './timezone.service';

describe('TimezoneService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimezoneService = TestBed.get(TimezoneService);
    expect(service).toBeTruthy();
  });

  it('should set timezone', () => {
    const service: TimezoneService = TestBed.get(TimezoneService);
    const tz = 'America/New_York';
    service.setTimezone(tz);
    expect(service.getTimezoneName()).toBe(tz);
    service.setTimezone();
  });

  it('should correct format with timezone', () => {
    const service: TimezoneService = TestBed.get(TimezoneService);
    service.setTimezone('America/New_York');
    expect(service.formatDate(moment.utc('2020-05-01T12:00'), 'de', 'DD.MM.YY HH:mm z')).toBe('01.05.20 08:00 EDT');
    service.setTimezone();
  });

});
