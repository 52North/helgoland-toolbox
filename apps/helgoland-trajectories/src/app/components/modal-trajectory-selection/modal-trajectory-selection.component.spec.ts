import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandSelectorModule } from '@helgoland/selector';

import { HelgolandCoreModule } from '../../../../../../libs/core/src';
import { HelgolandCommonModule } from '../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { TranslateTestingModule } from './../../../../../../libs/testing/translate.testing.module';
import { ModalTrajectorySelectionComponent } from './modal-trajectory-selection.component';
import { ParameterTypeLabelComponent } from './parameter-type-label/parameter-type-label.component';

describe('ModalTrajectorySelectionComponent', () => {
  let component: ModalTrajectorySelectionComponent;
  let fixture: ComponentFixture<ModalTrajectorySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalTrajectorySelectionComponent,
        ParameterTypeLabelComponent
      ],
      imports: [
        HelgolandCommonModule,
        HelgolandCoreModule,
        HelgolandSelectorModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatExpansionModule,
        NoopAnimationsModule,
        TranslateTestingModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTrajectorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
