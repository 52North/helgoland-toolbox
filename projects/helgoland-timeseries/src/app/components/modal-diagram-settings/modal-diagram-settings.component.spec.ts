import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ModalDiagramSettingsComponent } from './modal-diagram-settings.component';

describe('ModalDiagramSettingsComponent', () => {
  let component: ModalDiagramSettingsComponent;
  let fixture: ComponentFixture<ModalDiagramSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateTestingModule,
        HttpClientModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        ModalDiagramSettingsComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDiagramSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
