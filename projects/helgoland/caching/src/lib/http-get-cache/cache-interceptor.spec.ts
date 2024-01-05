import { inject, TestBed } from '@angular/core/testing';

import { HttpCache, OnGoingHttpCache } from '../model';
import { CachingInterceptor } from './cache-interceptor';

describe('CachingInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CachingInterceptor, HttpCache, OnGoingHttpCache],
    });
  });

  it('should be created', inject(
    [CachingInterceptor],
    (service: CachingInterceptor) => {
      expect(service).toBeTruthy();
    },
  ));
});
