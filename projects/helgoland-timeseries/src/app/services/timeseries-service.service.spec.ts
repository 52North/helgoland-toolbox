import { TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { TimeseriesService, TimeseriesServiceImpl } from './timeseries-service.service';

describe('TimeseriesServiceService', () => {
  let service: TimeseriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        {
          provide: TimeseriesService,
          useClass: TimeseriesServiceImpl
        }
      ]
    });
    service = TestBed.inject(TimeseriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
