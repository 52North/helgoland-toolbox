import { MatListModule } from '@angular/material/list';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../../libs/testing/translate.testing.module';
import {
  ModalMainConfigButtonComponent,
} from '../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import {
  TimeseriesListSelectorComponent,
} from '../../components/timeseries-list-selector/timeseries-list-selector.component';
import { HelgolandCommonModule } from './../../../../../../libs/helgoland-common/src/lib/helgoland-common.module';
import { ListSelectionViewComponent } from './list-selection-view.component';

describe('ListSelectionViewComponent', () => {
  let component: ListSelectionViewComponent;
  let fixture: ComponentFixture<ListSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ListSelectionViewComponent,
        ModalMainConfigButtonComponent,
        TimeseriesListSelectorComponent
      ],
      imports: [
        HelgolandCommonModule,
        HelgolandCoreModule,
        MatBadgeModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateTestingModule,
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
