import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandFavoriteModule } from '@helgoland/favorite';

import { TranslateTestingModule } from './../../../../../../../libs/testing/translate.testing.module';
import { FavoriteToggleButtonComponent } from './favorite-toggle-button.component';

describe('FavoriteToggleButtonComponent', () => {
  let component: FavoriteToggleButtonComponent;
  let fixture: ComponentFixture<FavoriteToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteToggleButtonComponent],
      imports: [
        HelgolandFavoriteModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        MatTooltipModule,
        MatIconModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteToggleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
