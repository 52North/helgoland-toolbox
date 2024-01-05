import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StringTogglerComponent } from './string-toggler.component';

describe('StringTogglerComponent', () => {
  let component: StringTogglerComponent;
  let fixture: ComponentFixture<StringTogglerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StringTogglerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringTogglerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
