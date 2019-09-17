import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerOpacitiySliderComponent } from './ol-layer-opacitiy-slider.component';

describe('OlLayerOpacitiySliderComponent', () => {
  let component: OlLayerOpacitiySliderComponent;
  let fixture: ComponentFixture<OlLayerOpacitiySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OlLayerOpacitiySliderComponent],
      imports: [HelgolandCoreModule, FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OlLayerOpacitiySliderComponent);
    component = fixture.componentInstance;
    expect(() => fixture.detectChanges()).toThrow();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
