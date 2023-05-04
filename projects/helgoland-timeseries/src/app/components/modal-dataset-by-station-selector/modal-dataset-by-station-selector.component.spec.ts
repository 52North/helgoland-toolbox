import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ModalDatasetByStationSelectorComponent } from './modal-dataset-by-station-selector.component';

describe('ModalDatasetByStationSelectorComponent', () => {
  let component: ModalDatasetByStationSelectorComponent;
  let fixture: ComponentFixture<ModalDatasetByStationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        HelgolandCoreModule,
        HelgolandLabelMapperModule,
        MatBadgeModule,
        MatDialogModule,
        MatExpansionModule,
        MatListModule,
        MatProgressBarModule,
        RouterTestingModule,
        TranslateTestingModule,
        ModalDatasetByStationSelectorComponent
    ]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDatasetByStationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
