import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteToggleButtonComponent } from './favorite-toggle-button.component';

describe('FavoriteToggleButtonComponent', () => {
  let component: FavoriteToggleButtonComponent;
  let fixture: ComponentFixture<FavoriteToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavoriteToggleButtonComponent ]
    })
    .compileComponents();
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
