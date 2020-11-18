import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryViewComponent } from './trajectory-view.component';

describe('TrajectoryViewComponent', () => {
  let component: TrajectoryViewComponent;
  let fixture: ComponentFixture<TrajectoryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajectoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
