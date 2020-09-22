import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandTimeRangeSliderModule } from './time-range-slider.module';

describe('TimeRangeSliderModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandTimeRangeSliderModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandTimeRangeSliderModule).toBeDefined();
  });
});
