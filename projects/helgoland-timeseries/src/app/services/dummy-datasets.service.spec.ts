import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { DummyDatasetsService } from './dummy-datasets.service';

describe('Service: DummyDatasets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DummyDatasetsService],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ]
    });
  });

  it('should ...', inject([DummyDatasetsService], (service: DummyDatasetsService) => {
    expect(service).toBeTruthy();
  }));
});
