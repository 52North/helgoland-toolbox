import { TestBed } from '@angular/core/testing';

import { DatasetApiV1Service } from './dataset-api-v1.service';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV1Service = TestBed.get(DatasetApiV1Service);
    expect(service).toBeTruthy();
  });
});
