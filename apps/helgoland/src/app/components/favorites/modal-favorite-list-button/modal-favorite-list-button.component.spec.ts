import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFavoriteListButtonComponent } from './modal-favorite-list-button.component';

describe('ModalFavoriteListButtonComponent', () => {
  let component: ModalFavoriteListButtonComponent;
  let fixture: ComponentFixture<ModalFavoriteListButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFavoriteListButtonComponent ]
    })
    .compileComponents();
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
