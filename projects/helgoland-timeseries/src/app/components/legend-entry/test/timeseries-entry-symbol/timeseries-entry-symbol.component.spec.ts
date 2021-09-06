/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TimeseriesEntrySymbolComponent } from './timeseries-entry-symbol.component';

describe('TimeseriesEntrySymbolComponent', () => {
  let component: TimeseriesEntrySymbolComponent;
  let fixture: ComponentFixture<TimeseriesEntrySymbolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesEntrySymbolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesEntrySymbolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
