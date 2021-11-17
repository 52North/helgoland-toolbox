/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { D3SeriesGraphOverviewWrapperComponent } from './d3-series-graph-overview-wrapper.component';

describe('DsSeriesGraphOverviewWrapperComponent', () => {
  let component: D3SeriesGraphOverviewWrapperComponent;
  let fixture: ComponentFixture<D3SeriesGraphOverviewWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SeriesGraphOverviewWrapperComponent ]
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
