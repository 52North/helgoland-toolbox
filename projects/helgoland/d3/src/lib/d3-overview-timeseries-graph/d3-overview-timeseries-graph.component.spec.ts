import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  DatasetApiV1ConnectorProvider,
  DatasetApiV2ConnectorProvider,
  DatasetApiV3ConnectorProvider,
  DatasetOptions,
  DatasetStaConnectorProvider,
  HelgolandCoreModule,
  Timespan,
} from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { SettingsServiceTestingProvider } from '../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandD3Module } from '../d3.module';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph.component';

describe('D3OverviewTimeseriesGraphComponent', () => {
  let component: D3OverviewTimeseriesGraphComponent;
  let fixture: ComponentFixture<D3OverviewTimeseriesGraphComponent>;
  const datasetID1 = 'https://fluggs.wupperverband.de/sws5/api/__26';
  const datasetID2 = 'https://fluggs.wupperverband.de/sws5/api/__139';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        DatasetApiInterfaceTesting,
        DatasetApiV1ConnectorProvider,
        DatasetApiV2ConnectorProvider,
        DatasetApiV3ConnectorProvider,
        DatasetStaConnectorProvider,
        SettingsServiceTestingProvider,
      ],
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        HelgolandD3Module,
        TranslateTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3OverviewTimeseriesGraphComponent);
    (fixture.nativeElement as HTMLElement).style.height = '250px';
    component = fixture.componentInstance;
  });

  it('should create', () => {
    const datasetOptions: Map<string, DatasetOptions> = new Map();
    component.datasetIds = [];

    const option1 = new DatasetOptions(datasetID1, '#FF0000');
    option1.pointRadius = 3;
    option1.lineWidth = 1;
    option1.visible = true;
    datasetOptions.set(datasetID1, option1);
    component.datasetIds.push(datasetID1);

    const option2 = new DatasetOptions(datasetID2, '#00FF00');
    option2.pointRadius = 3;
    option2.lineWidth = 1;
    option2.visible = true;
    datasetOptions.set(datasetID2, option2);
    component.datasetIds.push(datasetID2);

    component.timeInterval = new Timespan(
      new Date(2013, 5, 4, 0, 0),
      new Date(2013, 5, 5, 0, 0),
    );
    component.ngOnChanges({
      timeInterval: new SimpleChange(null, component.timeInterval, true),
    });
    component.datasetOptions = datasetOptions;
    component.presenterOptions = {
      showTimeLabel: false,
      copyright: {
        label: 'Copyright goes here',
        positionX: 'right',
        positionY: 'bottom',
      },
      overview: true,
    };
    component.onTimespanChanged.subscribe((timespan) => {
      component.timeInterval = timespan;
      component.ngOnChanges({
        timeInterval: new SimpleChange(null, timespan, true),
      });
      fixture.detectChanges();
    });

    fixture.detectChanges();
    expect(component.datasetIds).toBeDefined();
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBeGreaterThan(0);
    expect(typeof component.datasetIds).toBe('object');
  });
});
