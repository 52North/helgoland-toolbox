import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TrajectoryLabelComponent } from '../trajectory-label/trajectory-label.component';
import { TranslateTestingModule } from './../../../../../../libs/testing/translate.testing.module';
import { TrajectoryViewComponent } from './trajectory-view.component';

describe('TrajectoryViewComponent', () => {
  let component: TrajectoryViewComponent;
  let fixture: ComponentFixture<TrajectoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TrajectoryViewComponent,
        TrajectoryLabelComponent
      ],
      imports: [
        HelgolandCoreModule,
        RouterTestingModule,
        MatDialogModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatMenuModule,
        TranslateTestingModule
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
