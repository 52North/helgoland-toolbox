import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelectionViewComponent } from './map-selection-view.component';

describe('MapSelectionViewComponent', () => {
  let component: MapSelectionViewComponent;
  let fixture: ComponentFixture<MapSelectionViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapSelectionViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
