import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandD3Module } from '@helgoland/d3';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  FavoriteToggleButtonComponent,
} from '../../components/favorites/favorite-toggle-button/favorite-toggle-button.component';
import { LegendEntryComponent } from '../../components/legend-entry/legend-entry.component';
import {
  GeneralTimeSelectionComponent,
} from '../../components/time/general-time-selection/general-time-selection.component';
import {
  ModalFavoriteListButtonComponent,
} from './../../components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import {
  ModalMainConfigButtonComponent,
} from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { DiagramViewComponent } from './diagram-view.component';

describe('DiagramViewComponent', () => {
  let component: DiagramViewComponent;
  let fixture: ComponentFixture<DiagramViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        HelgolandCommonModule,
        HelgolandCoreModule,
        HelgolandD3Module,
        HelgolandFavoriteModule,
        HelgolandLabelMapperModule,
        MatBadgeModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TranslateTestingModule,
        DiagramViewComponent,
        ModalMainConfigButtonComponent,
        ModalFavoriteListButtonComponent,
        LegendEntryComponent,
        GeneralTimeSelectionComponent,
        FavoriteToggleButtonComponent
    ]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
