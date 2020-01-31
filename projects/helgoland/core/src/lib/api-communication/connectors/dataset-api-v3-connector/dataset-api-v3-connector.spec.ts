import { TestBed } from '@angular/core/testing';

import { DatasetApiV3Connector } from './dataset-api-v3-connector';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV3Connector = TestBed.get(DatasetApiV3Connector);
    expect(service).toBeTruthy();
  });
});
