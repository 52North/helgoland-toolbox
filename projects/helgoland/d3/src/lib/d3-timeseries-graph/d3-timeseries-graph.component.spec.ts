import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { D3TimeseriesGraphComponent } from './d3-timeseries-graph.component';
import { Timespan } from '../../../../core/src/public_api';

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
    expect(typeof(component.datasetIds)).toBe('object');
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBe(0);
  });

});

describe('D3TimeseriesGraphComponent - function', () => {
  let component: D3TimeseriesGraphComponent;
  let fixture: ComponentFixture<D3TimeseriesGraphComponent>;
  let datasetID26 = 'http://www.fluggs.de/sos2/api/v1/__26';

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
    component.datasetIds.push(datasetID26);
    fixture.detectChanges();
  });

  it('should have a dataset', () => {
    expect(component.datasetIds).toBeDefined();
    expect(component.datasetIds.length).toBeDefined();
    expect(component.datasetIds.length).toBeGreaterThan(0);
    expect(typeof(component.datasetIds)).toBe('object');
  });

  // it('Setting the main time interval changes the time interval', () => {
  //   let from = new Date().getTime() - 100000000;
  //   let to = new Date().getTime();
  //   // component.onTimespanChanged.emit(new Timespan(from, to));
  //   component.mainTimeInterval = new Timespan(from, to);
  //   fixture.detectChanges();
  //   expect(fixture.nativeElement.timeInterval).toEqual(new Timespan(from, to));
  // });

  // it('should set timespan', () => {
  //   let from = new Date().getTime() - 100000000;
  //   let to = new Date().getTime();
  //   component.onTimespanChanged.emit(new Timespan(from, to));
  //   console.log('#######\n##########\n');
  //   console.log(component.datasetIds);
  //   console.log(component.timeInterval);
  //   console.log(component.mainTimeInterval); // input
  //   component.ngDoCheck();
  //   console.log(component.datasetIds);
  //   console.log(component.timeInterval);
  //   console.log(component.mainTimeInterval);
  // });

});
