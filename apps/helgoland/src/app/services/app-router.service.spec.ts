import { TestBed } from '@angular/core/testing';

import { AppRouterService } from './app-router.service';

describe('AppRouterService', () => {
  let service: AppRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
