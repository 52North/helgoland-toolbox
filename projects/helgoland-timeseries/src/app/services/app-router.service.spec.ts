import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppRouterService } from './app-router.service';

describe('AppRouterService', () => {
  let service: AppRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ]
    });
    service = TestBed.inject(AppRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
