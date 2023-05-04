import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapCache } from '../../base/map-cache.service';
import { GeometryMapViewerComponent } from './geometry-map-viewer.component';

describe('GeometryMapViewerComponent', () => {
  let component: GeometryMapViewerComponent;
  let fixture: ComponentFixture<GeometryMapViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [GeometryMapViewerComponent],
    providers: [
        MapCache
    ]
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
