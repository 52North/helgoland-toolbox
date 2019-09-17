import { Component, Input } from '@angular/core';
import { Map } from 'ol';
import { OverviewMap } from 'ol/control.js';

import { OlBaseComponent } from '../../ol-base.component';

@Component({
  selector: 'n52-ol-overview-map',
  template: '',
})
export class OlOverviewMapComponent extends OlBaseComponent {

  @Input() collased = true;

  mapInitialized(map: Map) {
    const control = new OverviewMap({
      collapsed: this.collased
    });
    map.addControl(control);
  }

}
