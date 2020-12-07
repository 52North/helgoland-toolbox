import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParameterTypeLabelComponent } from './parameter-type-label.component';

describe('ParameterTypeLabelComponent', () => {
  let component: ParameterTypeLabelComponent;
  let fixture: ComponentFixture<ParameterTypeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParameterTypeLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParameterTypeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
