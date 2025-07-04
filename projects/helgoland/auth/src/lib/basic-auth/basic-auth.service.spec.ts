import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { BasicAuthService } from './basic-auth.service';

describe('BasicAuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        BasicAuthService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should be created', inject(
    [BasicAuthService],
    (service: BasicAuthService) => {
      expect(service).toBeTruthy();
    },
  ));
});
