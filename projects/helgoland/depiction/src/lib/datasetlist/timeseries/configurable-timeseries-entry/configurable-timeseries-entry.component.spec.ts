import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { SettingsServiceTestingProvider } from '../../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { ConfigurableTimeseriesEntryComponent } from './configurable-timeseries-entry.component';

describe('ConfigurableTimeseriesEntryComponent', () => {
  let component: ConfigurableTimeseriesEntryComponent;
  let fixture: ComponentFixture<ConfigurableTimeseriesEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [
        ConfigurableTimeseriesEntryComponent
      ],
      providers: [
        SettingsServiceTestingProvider
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
