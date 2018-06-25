import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringTogglerComponent } from './string-toggler.component';

describe('StringTogglerComponent', () => {
  let component: StringTogglerComponent;
  let fixture: ComponentFixture<StringTogglerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringTogglerComponent ]
    })
    .compileComponents();
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
