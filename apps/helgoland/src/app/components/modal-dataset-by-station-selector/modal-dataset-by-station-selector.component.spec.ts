import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../libs/testing/translate.testing.module';
import { ModalDatasetByStationSelectorComponent } from './modal-dataset-by-station-selector.component';

describe('ModalDatasetByStationSelectorComponent', () => {
  let component: ModalDatasetByStationSelectorComponent;
  let fixture: ComponentFixture<ModalDatasetByStationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDatasetByStationSelectorComponent],
      imports: [
        HelgolandCoreModule,
        TranslateTestingModule,
        RouterTestingModule,
        MatDialogModule,
        MatListModule,
        MatBadgeModule
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
