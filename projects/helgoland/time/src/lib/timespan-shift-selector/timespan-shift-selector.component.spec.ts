import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule, Timespan } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { TimespanShiftSelectorComponent } from './timespan-shift-selector.component';

describe('TimespanShiftSelectorComponent', () => {
  let component: TimespanShiftSelectorComponent;
  let fixture: ComponentFixture<TimespanShiftSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        TimespanShiftSelectorComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimespanShiftSelectorComponent);
    component = fixture.componentInstance;
    component.timespan = new Timespan(
      new Date().getTime() - 10000000,
      new Date().getTime(),
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
