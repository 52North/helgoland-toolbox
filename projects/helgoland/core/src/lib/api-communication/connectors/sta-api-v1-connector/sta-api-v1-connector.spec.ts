import { TestBed } from '@angular/core/testing';

import { StaApiV1Connector } from './sta-api-v1-connector';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaApiV1Connector = TestBed.get(StaApiV1Connector);
    expect(service).toBeTruthy();
  });
});
