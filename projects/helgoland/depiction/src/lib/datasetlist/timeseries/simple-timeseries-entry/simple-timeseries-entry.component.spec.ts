import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { SettingsServiceTestingProvider } from '../../../../../../../testing/settings.testing';
import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { SimpleTimeseriesEntryComponent } from './simple-timeseries-entry.component';

describe('SimpleTimeseriesEntryComponent', () => {
  let component: SimpleTimeseriesEntryComponent;
  let fixture: ComponentFixture<SimpleTimeseriesEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        SettingsServiceTestingProvider
      ],
      declarations: [SimpleTimeseriesEntryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTimeseriesEntryComponent);
    component = fixture.componentInstance;
    component.datasetId = "temp__temp";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
