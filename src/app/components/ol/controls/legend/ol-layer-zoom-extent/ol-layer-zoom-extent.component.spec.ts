import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerZoomExtentComponent } from './ol-layer-zoom-extent.component';

describe('OlLayerZoomExtentComponent', () => {
  let component: OlLayerZoomExtentComponent;
  let fixture: ComponentFixture<OlLayerZoomExtentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerZoomExtentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerZoomExtentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
