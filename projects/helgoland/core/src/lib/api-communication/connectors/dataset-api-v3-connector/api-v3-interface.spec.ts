import { TestBed } from '@angular/core/testing';

import { ApiV3InterfaceService } from './api-v3-interface';

describe('ApiV3InterfaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiV3InterfaceService = TestBed.get(ApiV3InterfaceService);
    expect(service).toBeTruthy();
  });
});
