import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { HelgolandFavoriteModule } from '@helgoland/favorite';

import { TranslateTestingModule } from '../../../../../../../libs/testing/translate.testing.module';
import { ModalFavoriteListComponent } from './modal-favorite-list.component';

describe('ModalFavoriteListComponent', () => {
  let component: ModalFavoriteListComponent;
  let fixture: ComponentFixture<ModalFavoriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalFavoriteListComponent],
      imports: [
        HelgolandFavoriteModule,
        HelgolandCoreModule,
        TranslateTestingModule
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
