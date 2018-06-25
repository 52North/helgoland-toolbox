import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule, Timespan } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3TimeseriesGraphComponent } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph.component';

describe('D3OverviewTimeseriesGraphComponent', () => {
  let component: D3OverviewTimeseriesGraphComponent;
  let fixture: ComponentFixture<D3OverviewTimeseriesGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        DatasetApiInterfaceTesting
      ],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [
        D3OverviewTimeseriesGraphComponent,
        D3TimeseriesGraphComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3OverviewTimeseriesGraphComponent);
    component = fixture.componentInstance;
    component.timeInterval = new Timespan(new Date().getTime() - 1000000, new Date().getTime());
    component.graphOptions = {
      selection: {}
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
