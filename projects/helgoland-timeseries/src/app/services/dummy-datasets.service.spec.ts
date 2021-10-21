/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DummyDatasetsService } from './dummy-datasets.service';

describe('Service: DummyDatasets', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DummyDatasetsService]
    });
  });

  it('should ...', inject([DummyDatasetsService], (service: DummyDatasetsService) => {
    expect(service).toBeTruthy();
  }));
});
