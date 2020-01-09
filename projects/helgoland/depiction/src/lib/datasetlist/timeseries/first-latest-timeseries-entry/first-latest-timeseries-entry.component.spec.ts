import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { FirstLatestTimeseriesEntryComponent } from './first-latest-timeseries-entry.component';

describe('FirstLatestTimeseriesEntryComponent', () => {
  let component: FirstLatestTimeseriesEntryComponent;
  let fixture: ComponentFixture<FirstLatestTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      declarations: [FirstLatestTimeseriesEntryComponent],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstLatestTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
