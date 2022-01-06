import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../testing/translate.testing.module';
import { DatasetsService } from './graph-datasets.service';

describe('Service: GraphDatasets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasetsService],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ]
    });
  });

  it('should ...', inject([DatasetsService], (service: DatasetsService) => {
    expect(service).toBeTruthy();
  }));
});
