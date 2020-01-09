import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { ConfigurableTimeseriesEntryComponent } from './configurable-timeseries-entry.component';

describe('ConfigurableTimeseriesEntryComponent', () => {
  let component: ConfigurableTimeseriesEntryComponent;
  let fixture: ComponentFixture<ConfigurableTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [ConfigurableTimeseriesEntryComponent],
      providers: []
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
