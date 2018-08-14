import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableTimeseriesEntryComponent } from './configurable-timeseries-entry.component';

describe('ConfigurableTimeseriesEntryComponent', () => {
  let component: ConfigurableTimeseriesEntryComponent;
  let fixture: ComponentFixture<ConfigurableTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurableTimeseriesEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
