import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HelgolandSelectorModule } from '@helgoland/selector';

import { HelgolandCommonModule } from '../../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { TranslateTestingModule } from '../../../../../../../libs/testing/translate.testing.module';
import {
  ModalMainConfigButtonComponent,
} from '../../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { ModalListSettingsComponent } from './modal-list-settings.component';

describe('ModalListSettingsComponent', () => {
  let component: ModalListSettingsComponent;
  let fixture: ComponentFixture<ModalListSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalListSettingsComponent
      ],
      imports: [
        TranslateTestingModule,
        HttpClientModule,
        HelgolandCommonModule,
        MatDialogModule,
        HelgolandSelectorModule
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
