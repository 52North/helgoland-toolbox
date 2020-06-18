import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoolTogglerComponent } from './bool-toggler.component';

describe('BoolTogglerComponent', () => {
  let component: BoolTogglerComponent;
  let fixture: ComponentFixture<BoolTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoolTogglerComponent ]
    })
    .compileComponents();
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