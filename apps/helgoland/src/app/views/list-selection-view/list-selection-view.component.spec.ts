import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../libs/testing/translate.testing.module';
import {
  ModalMainConfigButtonComponent,
} from '../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { ListSelectionViewComponent } from './list-selection-view.component';

describe('ListSelectionViewComponent', () => {
  let component: ListSelectionViewComponent;
  let fixture: ComponentFixture<ListSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListSelectionViewComponent,
        ModalMainConfigButtonComponent
      ],
      imports: [
        TranslateTestingModule,
        MatDialogModule,
        HelgolandCoreModule,
        RouterTestingModule,
        MatIconModule,
        MatBadgeModule,
        MatTooltipModule,
        MatToolbarModule,
        MatExpansionModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
