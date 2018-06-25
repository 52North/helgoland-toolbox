import { inject, TestBed } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { LocateService } from './locate.service';

describe('LocateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocateService,
        MapCache
      ]
    });
  });

  it('should be created', inject([LocateService], (service: LocateService) => {
    expect(service).toBeTruthy();
  }));
});
