import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { OlLayerOpacitiySliderComponent } from './ol-layer-opacitiy-slider.component';

describe('OlLayerOpacitiySliderComponent', () => {
  let component: OlLayerOpacitiySliderComponent;
  let fixture: ComponentFixture<OlLayerOpacitiySliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        FormsModule,
        OlLayerOpacitiySliderComponent,
      ],
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
