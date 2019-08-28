import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { LayerOpacitySliderComponent } from './layer-opacity-slider.component';

describe('LayerOpacitySliderComponent', () => {
  let component: LayerOpacitySliderComponent;
  let fixture: ComponentFixture<LayerOpacitySliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LayerOpacitySliderComponent],
      imports: [FormsModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayerOpacitySliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
