import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { StatusCheckService } from './status-check.service';

describe('StatusCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StatusCheckService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should be created', inject(
    [StatusCheckService],
    (service: StatusCheckService) => {
      expect(service).toBeTruthy();
    },
  ));
});
