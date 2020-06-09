import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { GeometryMapViewerComponent } from './geometry-map-viewer.component';

describe('GeometryMapViewerComponent', () => {
  let component: GeometryMapViewerComponent;
  let fixture: ComponentFixture<GeometryMapViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MapCache
      ],
      declarations: [GeometryMapViewerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeometryMapViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
