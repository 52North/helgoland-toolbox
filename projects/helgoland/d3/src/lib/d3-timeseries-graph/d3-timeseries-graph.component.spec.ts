import { HttpClientModule } from '@angular/common/http';
import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DatasetOptions, DefinedTimespan, DefinedTimespanService, HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HoveringStyle } from '../model/d3-plot-options';
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

fdescribe('D3TimeseriesGraphComponent - function', () => {
  let component: D3TimeseriesGraphComponent;
  let fixture: ComponentFixture<D3TimeseriesGraphComponent>;
  let datasetID1 = 'http://www.fluggs.de/sos2/api/v1/__49';
  // let datasetID2 = 'http://geo.irceline.be/sos/api/v1/__6522';
  let definedTimespanSrvc: DefinedTimespanService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting,
        DefinedTimespanService
      ],
      declarations: [D3TimeseriesGraphComponent]
    }).compileComponents();
  }));

  beforeEach(inject([DefinedTimespanService], (service: DefinedTimespanService) => {
    fixture = TestBed.createComponent(D3TimeseriesGraphComponent);
    (fixture.nativeElement as HTMLElement).style.height = '500px';
    component = fixture.componentInstance;
    definedTimespanSrvc = service;
  }));

  it('should have a dataset', () => {
    const datasetOptions: Map<string, DatasetOptions> = new Map();
    const option1 = new DatasetOptions(datasetID1, '#FF0000');
    // option1.type = 'bar';
    option1.barPeriod = 'PT1H';
    option1.barStartOf = 'hour';
    option1.lineDashArray = [5, 5];
    option1.separateYAxis = false;
    option1.showReferenceValues = [{
      id: '239',
      color: '#00FF00'
    }, {
      id: '240',
      color: '#00FF00'
    }];
    // option1.yAxisRange = {
    //   min: 0.2,
    //   max: 0.7
    // };
    option1.pointRadius = 4;
    option1.lineWidth = 2;
    option1.visible = true;
    component.presenterOptions = { requestBeforeAfterValues: true };
    // const option2 = new DatasetOptions(datasetID2, '#00FF00');
    // option2.pointRadius = 4;
    // option2.pointBorderWidth = 1;
    // option2.pointBorderColor = 'black';
    // option2.lineDashArray = 5;
    // option2.separateYAxis = false;
    // option2.yAxisRange = {
    //   min: 0,
    //   max: 10
    // };
    // option2.lineWidth = 2;
    // option2.visible = true;
    datasetOptions.set(datasetID1, option1);
    // datasetOptions.set(datasetID2, option2);
    component.presenterOptions.hoverStyle = HoveringStyle.point;
    component.timeInterval = definedTimespanSrvc.getInterval(DefinedTimespan.TODAY);
    component.ngOnChanges({ timeInterval: new SimpleChange(null, component.timeInterval, true) });
    component.datasetIds = [datasetID1];
    component.datasetOptions = datasetOptions;
    // component.selectedDatasetIds = [datasetID2];
    component.presenterOptions = { showReferenceValues: true };
    component.onTimespanChanged.subscribe(timespan => {
      component.timeInterval = timespan;
      component.ngOnChanges({ timeInterval: new SimpleChange(null, timespan, true) });
    });
    fixture.detectChanges();
    expect(component.datasetIds).toBeDefined();
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBeGreaterThan(0);
    expect(typeof (component.datasetIds)).toBe('object');

    // setTimeout(() => {
    //   // component.datasetOptions.delete(datasetID1);
    //   // component.datasetIds.shift();
    //   component.selectedDatasetIds.push(datasetID1);
    //   if (!fixture['destroyed']) {
    //     fixture.detectChanges();
    //   }
    // }, 5000);
  });

});
