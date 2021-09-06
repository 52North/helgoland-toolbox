import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { TimeseriesListSelectorComponent } from './timeseries-list-selector.component';

describe('TimeseriesListSelectorComponent', () => {
  let component: TimeseriesListSelectorComponent;
  let fixture: ComponentFixture<TimeseriesListSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeseriesListSelectorComponent],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        MatListModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesListSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
