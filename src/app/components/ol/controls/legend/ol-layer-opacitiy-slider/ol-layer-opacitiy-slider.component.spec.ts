import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OlLayerOpacitiySliderComponent } from './ol-layer-opacitiy-slider.component';

describe('OlLayerOpacitiySliderComponent', () => {
  let component: OlLayerOpacitiySliderComponent;
  let fixture: ComponentFixture<OlLayerOpacitiySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OlLayerOpacitiySliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerOpacitiySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
