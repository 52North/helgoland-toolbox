import { TestBed } from '@angular/core/testing';

import { TrajectoriesService } from './trajectories.service';

describe('TrajectoriesService', () => {
  let service: TrajectoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrajectoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
