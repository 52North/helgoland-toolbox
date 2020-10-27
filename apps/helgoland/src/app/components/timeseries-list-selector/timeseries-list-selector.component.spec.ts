import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesListSelectorComponent } from './timeseries-list-selector.component';

describe('TimeseriesListSelectorComponent', () => {
  let component: TimeseriesListSelectorComponent;
  let fixture: ComponentFixture<TimeseriesListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeseriesListSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
