import { Component, input } from '@angular/core';
import BaseLayer from 'ol/layer/Base';

/**
 * Legend component to toggle the visibility
 */
@Component({
  selector: 'n52-ol-layer-visibility-toggler',
  templateUrl: './ol-layer-visibility-toggler.component.html',
  standalone: true,
})
export class OlLayerVisibilityTogglerComponent {
  readonly layer = input.required<BaseLayer>();

  public toggleVisibility() {
    this.layer().setVisible(!this.layer().getVisible());
  }
}
