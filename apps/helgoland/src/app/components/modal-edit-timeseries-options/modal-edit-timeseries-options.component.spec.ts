import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditTimeseriesOptionsComponent } from './modal-edit-timeseries-options.component';

describe('ModalEditTimeseriesOptionsComponent', () => {
  let component: ModalEditTimeseriesOptionsComponent;
  let fixture: ComponentFixture<ModalEditTimeseriesOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditTimeseriesOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditTimeseriesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
