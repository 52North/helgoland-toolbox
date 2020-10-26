import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTimeSelectionComponent } from './general-time-selection.component';

describe('GeneralTimeSelectionComponent', () => {
  let component: GeneralTimeSelectionComponent;
  let fixture: ComponentFixture<GeneralTimeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTimeSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralTimeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
