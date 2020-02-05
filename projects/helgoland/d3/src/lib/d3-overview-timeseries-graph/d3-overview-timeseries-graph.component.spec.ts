import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule, Timespan } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandD3Module } from '../d3.module';
import { SettingsServiceTestingProvider } from './../../../../../testing/settings.testing';
import { D3OverviewTimeseriesGraphComponent } from './d3-overview-timeseries-graph.component';

describe('D3OverviewTimeseriesGraphComponent', () => {
  let component: D3OverviewTimeseriesGraphComponent;
  let fixture: ComponentFixture<D3OverviewTimeseriesGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        SettingsServiceTestingProvider
      ],
      imports: [
        HelgolandCoreModule,
        HelgolandD3Module,
        TranslateTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3OverviewTimeseriesGraphComponent);
    component = fixture.componentInstance;
    component.timeInterval = new Timespan(new Date().getTime() - 1000000, new Date().getTime());
    component.presenterOptions = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
