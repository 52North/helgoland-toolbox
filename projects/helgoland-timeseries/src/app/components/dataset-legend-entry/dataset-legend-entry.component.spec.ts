import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { DatasetLegendEntryComponent } from './dataset-legend-entry.component';

describe('DatasetLegendEntryComponent', () => {
  let component: DatasetLegendEntryComponent;
  let fixture: ComponentFixture<DatasetLegendEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetLegendEntryComponent],
      imports: [
        TranslateTestingModule,
        HelgolandCoreModule,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetLegendEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
