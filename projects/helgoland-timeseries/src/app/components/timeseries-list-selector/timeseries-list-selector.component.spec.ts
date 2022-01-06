import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { TimeseriesService, TimeseriesServiceImpl } from '../../services/timeseries-service.service';
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
      ],
      providers: [
        {
          provide: TimeseriesService,
          useClass: TimeseriesServiceImpl
        }
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
