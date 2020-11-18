import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryLabelComponent } from './trajectory-label.component';

describe('TrajectoryLabelComponent', () => {
  let component: TrajectoryLabelComponent;
  let fixture: ComponentFixture<TrajectoryLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
