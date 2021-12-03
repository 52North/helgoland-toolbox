import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { D3SeriesGraphOverviewWrapperComponent } from './d3-series-graph-overview-wrapper.component';

/* tslint:disable:no-unused-variable */
describe('DsSeriesGraphOverviewWrapperComponent', () => {
  let component: D3SeriesGraphOverviewWrapperComponent;
  let fixture: ComponentFixture<D3SeriesGraphOverviewWrapperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ],
      declarations: [D3SeriesGraphOverviewWrapperComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SeriesGraphOverviewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
