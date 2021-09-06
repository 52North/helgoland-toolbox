import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DarkModeButtonComponent } from './dark-mode-button.component';

describe('DarkModeButtonComponent', () => {
  let component: DarkModeButtonComponent;
  let fixture: ComponentFixture<DarkModeButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DarkModeButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkModeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
