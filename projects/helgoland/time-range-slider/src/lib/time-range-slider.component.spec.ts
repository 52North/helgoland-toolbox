import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeSliderComponent } from './time-range-slider.component';
import { TimeRangeSliderCache } from './time-range-slider.service';

describe('TimeRangeSliderComponent', () => {
  let component: TimeRangeSliderComponent;
  let fixture: ComponentFixture<TimeRangeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeRangeSliderCache
      ],
      declarations: [TimeRangeSliderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
