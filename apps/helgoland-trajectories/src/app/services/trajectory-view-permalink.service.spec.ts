import { TestBed } from '@angular/core/testing';

import { TrajectoryViewPermalinkService } from './trajectory-view-permalink.service';

describe('TrajectoryViewPermalinkService', () => {
  let service: TrajectoryViewPermalinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrajectoryViewPermalinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
