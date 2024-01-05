import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TrajectoryViewPermalinkService } from './trajectory-view-permalink.service';

describe('TrajectoryViewPermalinkService', () => {
  let service: TrajectoryViewPermalinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule, RouterTestingModule],
    });
    service = TestBed.inject(TrajectoryViewPermalinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
