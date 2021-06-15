import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandMapSelectorModule } from '@helgoland/map';

import { HelgolandCommonModule } from 'helgoland-common';
import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import {
  ModalMainConfigButtonComponent,
} from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { MapSelectionViewComponent } from './map-selection-view.component';

describe('MapSelectionViewComponent', () => {
  let component: MapSelectionViewComponent;
  let fixture: ComponentFixture<MapSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MapSelectionViewComponent,
        ModalMainConfigButtonComponent
      ],
      imports: [
        HelgolandCommonModule,
        HelgolandCoreModule,
        HelgolandMapSelectorModule,
        MatBadgeModule,
        MatDialogModule,
        MatIconModule,
        MatSidenavModule,
        MatToolbarModule,
        MatTooltipModule,
        RouterTestingModule,
        TranslateTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
