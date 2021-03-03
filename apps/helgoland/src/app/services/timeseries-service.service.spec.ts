import { TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TimeseriesService } from './timeseries-service.service';

describe('TimeseriesServiceService', () => {
  let service: TimeseriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ]
    });
    service = TestBed.inject(TimeseriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
