import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetOptions, HelgolandCoreModule, Timespan } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph.component';

describe('D3TimeseriesGraphComponent - raw', () => {
  let component: D3TimeseriesGraphComponent;
  let fixture: ComponentFixture<D3TimeseriesGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [D3TimeseriesGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TimeseriesGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create svg', () => {
    let compiled = fixture.debugElement.nativeElement;
    expect(fixture.nativeElement.querySelector('svg')).not.toBe(null);
    expect(compiled.querySelector('svg')).not.toBe(null);
  });

  it('should have option variables to be undefined', () => {
    expect(component.presenterOptions).toBe(undefined);
    expect(component.isContentLoading).toBe(undefined);
    expect(component.mainTimeInterval).toBe(undefined);
    expect(component.timeInterval).toBe(undefined);
  });

  it('should have no datasetIds', () => {
    expect(component.datasetIds).toBeDefined();
    expect(typeof (component.datasetIds)).toBe('object');
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBe(0);
  });

});

describe('D3TimeseriesGraphComponent - function', () => {
  let component: D3TimeseriesGraphComponent;
  let fixture: ComponentFixture<D3TimeseriesGraphComponent>;
  let datasetID1 = 'http://mudak-wrm.dev.52north.org/52n-sos-wv-webapp/api/v1/__17';
  let datasetID2 = 'http://geo.irceline.be/sos/api/v1/__6522';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [D3TimeseriesGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TimeseriesGraphComponent);
    (fixture.nativeElement as HTMLElement).style.height = '500px';
    component = fixture.componentInstance;
    const datasetOptions: Map<string, DatasetOptions> = new Map();
    const option1 = new DatasetOptions(datasetID1, '#FF0000');
    option1.pointRadius = 4;
    option1.lineWidth = 2;
    option1.visible = true;
    component.presenterOptions = { requestBeforeAfterValues: true };
    const option2 = new DatasetOptions(datasetID2, '#00FF00');
    option2.pointRadius = 4;
    option2.lineWidth = 2;
    option2.visible = true;
    datasetOptions.set(datasetID1, option1);
    datasetOptions.set(datasetID2, option2);
    const end = new Date(1900).getTime();
    const diff = 100000000;
    component.timeInterval = new Timespan(end - diff, end);
    component.ngOnChanges({ timeInterval: new SimpleChange(null, component.timeInterval, true) });
    component.datasetIds = [datasetID1, datasetID2];
    component.datasetOptions = datasetOptions;
    component.onTimespanChanged.subscribe(timespan => {
      component.timeInterval = timespan;
      component.ngOnChanges({ timeInterval: new SimpleChange(null, timespan, true) });
    });
    setInterval(() => fixture.detectChanges(), 100);
  });

  it('should have a dataset', () => {
    expect(component.datasetIds).toBeDefined();
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBeGreaterThan(0);
    expect(typeof (component.datasetIds)).toBe('object');
  });

});
