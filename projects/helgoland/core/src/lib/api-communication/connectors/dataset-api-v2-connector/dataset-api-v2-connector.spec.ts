import { TestBed } from '@angular/core/testing';

import { DatasetApiV2Connector } from './dataset-api-v2-connector';

describe('DatasetApiV2Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetApiV2Connector = TestBed.get(DatasetApiV2Connector);
    expect(service).toBeTruthy();
  });
});
