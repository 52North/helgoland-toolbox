import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerLegendUrlComponent } from './ol-layer-legend-url.component';

describe('OlLayerLegendUrlComponent', () => {
  let component: OlLayerLegendUrlComponent;
  let fixture: ComponentFixture<OlLayerLegendUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerLegendUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerLegendUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
