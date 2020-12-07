import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrajectorySelectionComponent } from './modal-trajectory-selection.component';

describe('ModalTrajectorySelectionComponent', () => {
  let component: ModalTrajectorySelectionComponent;
  let fixture: ComponentFixture<ModalTrajectorySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTrajectorySelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTrajectorySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
