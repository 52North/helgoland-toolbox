import { Component, Input } from '@angular/core';
import { Required } from '@helgoland/core';
import BaseLayer from 'ol/layer/Base';

@Component({
  selector: 'n52-ol-layer-visibility-toggler',
  templateUrl: './ol-layer-visibility-toggler.component.html'
})
export class OlLayerVisibilityTogglerComponent {

  @Required @Input() layer: BaseLayer;

  public toggleVisibility() {
    this.layer.setVisible(!this.layer.getVisible());
  }

}
