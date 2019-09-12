import { TestBed } from '@angular/core/testing';

import { WmsCapabilitiesService } from './wms-capabilities.service';

describe('WmsCapabilitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WmsCapabilitiesService = TestBed.get(WmsCapabilitiesService);
    expect(service).toBeTruthy();
  });
});
