import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurableTimeseriesEntryComponent } from './configurable-timeseries-entry.component';
import { DatasetApiInterfaceTesting } from '../../../../../../../testing/dataset-api-interface.testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';

describe('ConfigurableTimeseriesEntryComponent', () => {
  let component: ConfigurableTimeseriesEntryComponent;
  let fixture: ComponentFixture<ConfigurableTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [ ConfigurableTimeseriesEntryComponent ],
      providers: [
        DatasetApiInterfaceTesting
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurableTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
