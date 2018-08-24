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
    expect(component.graphOptions).toBe(undefined);
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
  let datasetID6899 = 'http://geo.irceline.be/sos/api/v1/__6899';
  let datasetID6522 = 'http://geo.irceline.be/sos/api/v1/__6522';

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
    const option6899 = new DatasetOptions(datasetID6899, '#FF0000');
    option6899.pointRadius = 4;
    option6899.lineWidth = 2;
    option6899.visible = true;
    const option6522 = new DatasetOptions(datasetID6522, '#00FF00');
    option6522.pointRadius = 4;
    option6522.lineWidth = 2;
    option6522.visible = true;
    datasetOptions.set(datasetID6899, option6899);
    datasetOptions.set(datasetID6522, option6522);
    const end = new Date().getTime();
    const diff = 360000000;
    component.timeInterval = new Timespan(end - diff, end);
    component.ngOnChanges({ timeInterval: new SimpleChange(null, component.timeInterval, true) });
    component.datasetIds = [datasetID6899, datasetID6522];
    component.datasetOptions = datasetOptions;
    fixture.detectChanges();
  });

  it('should have a dataset', () => {
    expect(component.datasetIds).toBeDefined();
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBeGreaterThan(0);
    expect(typeof (component.datasetIds)).toBe('object');
  });

});
