import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDatasetByStationSelectorComponent } from './modal-dataset-by-station-selector.component';

describe('ModalDatasetByStationSelectorComponent', () => {
  let component: ModalDatasetByStationSelectorComponent;
  let fixture: ComponentFixture<ModalDatasetByStationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDatasetByStationSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDatasetByStationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
