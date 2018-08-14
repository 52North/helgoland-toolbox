import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTimeseriesEntryComponent } from './simple-timeseries-entry.component';

describe('SimpleTimeseriesEntryComponent', () => {
  let component: SimpleTimeseriesEntryComponent;
  let fixture: ComponentFixture<SimpleTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleTimeseriesEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
