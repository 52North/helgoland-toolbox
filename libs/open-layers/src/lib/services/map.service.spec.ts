import { TestBed } from '@angular/core/testing';

import { OlMapService } from './map.service';

describe('MapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OlMapService = TestBed.inject(OlMapService);
    expect(service).toBeTruthy();
  });
});
