import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HelgolandSelectorModule } from '@helgoland/selector';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { ModalListSettingsComponent } from './modal-list-settings.component';

describe('ModalListSettingsComponent', () => {
  let component: ModalListSettingsComponent;
  let fixture: ComponentFixture<ModalListSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        TranslateTestingModule,
        HttpClientModule,
        HelgolandCommonModule,
        MatDialogModule,
        HelgolandSelectorModule,
        ModalListSettingsComponent
    ],
    providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
