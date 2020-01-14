import { TestBed } from '@angular/core/testing';

import { DatasetApiV2Service } from './dataset-api-v2.service';

describe('DatasetApiV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV2Service = TestBed.get(DatasetApiV2Service);
    expect(service).toBeTruthy();
  });
});
