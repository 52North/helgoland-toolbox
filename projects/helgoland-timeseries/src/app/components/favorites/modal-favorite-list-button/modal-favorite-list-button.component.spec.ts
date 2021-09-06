import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandFavoriteModule } from '@helgoland/favorite';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { ModalFavoriteListButtonComponent } from './modal-favorite-list-button.component';

describe('ModalFavoriteListButtonComponent', () => {
  let component: ModalFavoriteListButtonComponent;
  let fixture: ComponentFixture<ModalFavoriteListButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFavoriteListButtonComponent],
      imports: [
        MatDialogModule,
        HelgolandFavoriteModule,
        HelgolandCoreModule,
        TranslateTestingModule,
        MatIconModule,
        MatBadgeModule,
        MatTooltipModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFavoriteListButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
