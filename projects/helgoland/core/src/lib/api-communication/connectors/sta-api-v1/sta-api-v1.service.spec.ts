import { TestBed } from '@angular/core/testing';

import { StaApiV1Service } from './sta-api-v1.service';

describe('DatasetApiV1Service', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaApiV1Service = TestBed.get(StaApiV1Service);
    expect(service).toBeTruthy();
  });
});
