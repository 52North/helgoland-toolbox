import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandFavoriteModule } from '@helgoland/favorite';

import { TranslateTestingModule } from '../../../../../../testing/translate.testing.module';
import { EditLabelComponent } from '../../edit-label/edit-label.component';
import { ModalFavoriteListComponent } from './modal-favorite-list.component';

describe('ModalFavoriteListComponent', () => {
  let component: ModalFavoriteListComponent;
  let fixture: ComponentFixture<ModalFavoriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ModalFavoriteListComponent,
        EditLabelComponent
      ],
      imports: [
        FormsModule,
        HelgolandCoreModule,
        HelgolandFavoriteModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        TranslateTestingModule,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFavoriteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
