import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from './../../../testing/translate.testing.module';
import { TimeRangeSliderComponent } from './time-range-slider.component';
import { TimeRangeSliderCache } from './time-range-slider.service';

describe('TimeRangeSliderComponent', () => {
  let component: TimeRangeSliderComponent;
  let fixture: ComponentFixture<TimeRangeSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeRangeSliderCache
      ],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
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
