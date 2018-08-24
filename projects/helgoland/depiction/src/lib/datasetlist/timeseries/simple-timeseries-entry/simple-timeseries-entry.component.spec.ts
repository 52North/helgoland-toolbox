import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTimeseriesEntryComponent } from './simple-timeseries-entry.component';
import { DatasetApiInterfaceTesting } from '../../../../../../../testing/dataset-api-interface.testing';
import { TranslateTestingModule } from '../../../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '@helgoland/core';

describe('SimpleTimeseriesEntryComponent', () => {
  let component: SimpleTimeseriesEntryComponent;
  let fixture: ComponentFixture<SimpleTimeseriesEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        DatasetApiInterfaceTesting
      ],
      declarations: [ SimpleTimeseriesEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTimeseriesEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
