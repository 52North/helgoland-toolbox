import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimeseriesSymbolSelectComponent } from './timeseries-symbol-select.component';

/* tslint:disable:no-unused-variable */
describe('TimeseriesSymbolSelectComponent', () => {
  let component: TimeseriesSymbolSelectComponent;
  let fixture: ComponentFixture<TimeseriesSymbolSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TimeseriesSymbolSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesSymbolSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
