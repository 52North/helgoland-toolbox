/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { D3SeriesGraphWrapperComponent } from './d3-series-graph-wrapper.component';

describe('D3SeriesGraphWrapperComponent', () => {
  let component: D3SeriesGraphWrapperComponent;
  let fixture: ComponentFixture<D3SeriesGraphWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3SeriesGraphWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3SeriesGraphWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
