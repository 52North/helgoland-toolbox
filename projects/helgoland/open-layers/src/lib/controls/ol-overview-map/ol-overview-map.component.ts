import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Map } from 'ol';
import { OverviewMap } from 'ol/control';
import { Layer } from 'ol/layer';

import { OlBaseComponent } from '../../ol-base.component';

/**
 * Control component for an overview map
 */
@Component({
    selector: 'n52-ol-overview-map',
    template: '',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['ol-overview-map.component.scss'],
    standalone: true
})
export class OlOverviewMapComponent extends OlBaseComponent {

  /**
   * Collapsed on startup
   */
  @Input() collased = true;

  /**
   * Can be collapsed
   */
  @Input() collapsible = true;

  /**
   * Layers, which are shown in the overview map
   */
  @Input() layers: Layer[] = [];

  /**
   * position of the overview map
   */
  @Input() position: 'upperleft' | 'upperright' | 'bottomleft' | 'bottomright' = 'bottomleft';

  mapInitialized(map: Map) {
    const control = new OverviewMap({
      className: this.generateClassName(),
      collapseLabel: this.createCollapseLabel(),
      label: this.createLabel(),
      collapsed: this.collased,
      collapsible: this.collapsible,
      layers: this.layers
    });
    map.addControl(control);
  }

  private createLabel(): string {
    if (this.position === 'bottomright' || this.position === 'upperright') {
      return '\u00AB';
    } else {
      return '\u00BB';
    }
  }

  private createCollapseLabel(): string {
    if (this.position === 'bottomright' || this.position === 'upperright') {
      return '\u00BB';
    } else {
      return '\u00AB';
    }
  }

  generateClassName(): string {
    return `ol-overviewmap ol-custom-overviewmap ol-${this.position}-overviewmap`;
  }

}
