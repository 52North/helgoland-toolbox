import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';

describe('HttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [HttpService, provideHttpClient(withInterceptorsFromDi())],
    });
  });

  it('should be created', inject([HttpService], (service: HttpService) => {
    expect(service).toBeTruthy();
  }));
});
