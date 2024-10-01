import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerZoomExtentComponent } from './ol-layer-zoom-extent.component';

describe('OlLayerZoomExtentComponent', () => {
  let component: OlLayerZoomExtentComponent;
  let fixture: ComponentFixture<OlLayerZoomExtentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule, OlLayerZoomExtentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerZoomExtentComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
