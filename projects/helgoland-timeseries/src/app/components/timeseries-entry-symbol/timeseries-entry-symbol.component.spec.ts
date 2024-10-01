/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeseriesEntrySymbolComponent } from './timeseries-entry-symbol.component';

describe('TimeseriesEntrySymbolComponent', () => {
  let component: TimeseriesEntrySymbolComponent;
  let fixture: ComponentFixture<TimeseriesEntrySymbolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TimeseriesEntrySymbolComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesEntrySymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
