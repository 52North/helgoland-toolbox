import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { GeneralTimeSelectionComponent } from './general-time-selection.component';

describe('GeneralTimeSelectionComponent', () => {
  let component: GeneralTimeSelectionComponent;
  let fixture: ComponentFixture<GeneralTimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralTimeSelectionComponent],
      imports: [
        HelgolandCoreModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatMomentDateModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        TranslateTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
