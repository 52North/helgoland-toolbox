import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandDatasetlistModule, HelgolandLabelMapperModule } from '@helgoland/depiction';

import { TranslateTestingModule } from '../../../../../../libs/testing/translate.testing.module';
import { HelgolandFavoriteModule } from './../../../../../../libs/favorite/src/lib/favorite.module';
import { FavoriteToggleButtonComponent } from './../favorites/favorite-toggle-button/favorite-toggle-button.component';
import { LegendEntryComponent } from './legend-entry.component';

describe('LegendEntryComponent', () => {
  let component: LegendEntryComponent;
  let fixture: ComponentFixture<LegendEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LegendEntryComponent,
        FavoriteToggleButtonComponent
      ],
      imports: [
        HelgolandCoreModule,
        HelgolandDatasetlistModule,
        TranslateTestingModule,
        MatExpansionModule,
        HelgolandLabelMapperModule,
        MatIconModule,
        HelgolandFavoriteModule,
        NoopAnimationsModule,
        MatTooltipModule
      ]
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
