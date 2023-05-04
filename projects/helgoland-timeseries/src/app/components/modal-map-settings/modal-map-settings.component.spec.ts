import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ModalMapSettingsComponent } from './modal-map-settings.component';

describe('ModalMapSettingsComponent', () => {
  let component: ModalMapSettingsComponent;
  let fixture: ComponentFixture<ModalMapSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateTestingModule,
        HttpClientModule,
        MatDialogModule,
        MatSlideToggleModule,
        HelgolandCommonModule,
        HelgolandSelectorModule,
        ModalMapSettingsComponent
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMapSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
