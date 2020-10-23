import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFavoriteListComponent } from './modal-favorite-list.component';

describe('ModalFavoriteListComponent', () => {
  let component: ModalFavoriteListComponent;
  let fixture: ComponentFixture<ModalFavoriteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalFavoriteListComponent ]
    })
    .compileComponents();
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
