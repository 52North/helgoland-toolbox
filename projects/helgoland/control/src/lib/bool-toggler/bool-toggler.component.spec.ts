import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BoolTogglerComponent } from './bool-toggler.component';

describe('BoolTogglerComponent', () => {
  let component: BoolTogglerComponent;
  let fixture: ComponentFixture<BoolTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BoolTogglerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoolTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
