import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandCoreModule } from '@helgoland/core';
import {
  HelgolandDatasetlistModule,
  HelgolandLabelMapperModule,
} from '@helgoland/depiction';
import { HelgolandFavoriteModule } from '@helgoland/favorite';
import { HelgolandCommonModule } from 'helgoland-common';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { FavoriteToggleButtonComponent } from './../favorites/favorite-toggle-button/favorite-toggle-button.component';
import { LegendEntryComponent } from './legend-entry.component';

describe('LegendEntryComponent', () => {
  let component: LegendEntryComponent;
  let fixture: ComponentFixture<LegendEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HelgolandCommonModule,
        HelgolandCoreModule,
        HelgolandDatasetlistModule,
        HelgolandFavoriteModule,
        HelgolandLabelMapperModule,
        MatExpansionModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTooltipModule,
        NoopAnimationsModule,
        TranslateTestingModule,
        LegendEntryComponent,
        FavoriteToggleButtonComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
