import { TestBed } from '@angular/core/testing';

import { DatasetApiV3Service } from './dataset-api-v3.service';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV3Service = TestBed.get(DatasetApiV3Service);
    expect(service).toBeTruthy();
  });
});
