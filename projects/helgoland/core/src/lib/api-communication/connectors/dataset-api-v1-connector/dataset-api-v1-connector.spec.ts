import { TestBed } from '@angular/core/testing';

import { DatasetApiV1Connector } from './dataset-api-v1-connector';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV1Connector = TestBed.get(DatasetApiV1Connector);
    expect(service).toBeTruthy();
  });
});
