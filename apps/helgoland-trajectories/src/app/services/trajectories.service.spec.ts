import { TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '../../../../../libs/core/src';

import { TrajectoriesService } from './trajectories.service';

describe('TrajectoriesService', () => {
  let service: TrajectoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ]
    });
    service = TestBed.inject(TrajectoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
