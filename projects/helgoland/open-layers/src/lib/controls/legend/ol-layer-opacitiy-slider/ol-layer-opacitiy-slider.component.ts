import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import BaseLayer from 'ol/layer/Base';

/**
 * Legend component handle the opacity of the layer
 */
@Component({
  selector: 'n52-ol-layer-opacitiy-slider',
  templateUrl: './ol-layer-opacitiy-slider.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class OlLayerOpacitiySliderComponent implements OnInit, DoCheck {
  @Input({ required: true })
  layer!: BaseLayer;

  public opacity: number | undefined;

  constructor() {}

  ngOnInit(): void {
    this.opacity = this.layer.getOpacity() * 100;
  }

  ngDoCheck() {
    const o = this.layer.getOpacity() * 100;
    if (this.layer && o !== this.opacity) {
      this.opacity = o;
    }
  }

  setOpacity(o: number) {
    this.opacity = o;
    if (this.layer) {
      this.layer.setOpacity(this.opacity / 100);
    }
  }
}
