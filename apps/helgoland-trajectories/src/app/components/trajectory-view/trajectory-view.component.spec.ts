import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandMapViewModule } from '@helgoland/map';
import { ColorPickerModule } from 'ngx-color-picker';

import { LegendEntryComponent } from '../legend-entry/legend-entry.component';
import { TrajectoryLabelComponent } from '../trajectory-label/trajectory-label.component';
import { HelgolandCommonModule } from './../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { TranslateTestingModule } from './../../../../../../libs/testing/translate.testing.module';
import { TrajectoryViewComponent } from './trajectory-view.component';

describe('TrajectoryViewComponent', () => {
  let component: TrajectoryViewComponent;
  let fixture: ComponentFixture<TrajectoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TrajectoryViewComponent,
        TrajectoryLabelComponent,
        LegendEntryComponent
      ],
      imports: [
        ColorPickerModule,
        HelgolandCommonModule,
        HelgolandCoreModule,
        HelgolandD3Module,
        HelgolandMapViewModule,
        MatCheckboxModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatRadioModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
