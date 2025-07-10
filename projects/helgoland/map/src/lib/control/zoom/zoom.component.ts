import { Component } from '@angular/core';

import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-zoom-control',
  templateUrl: './zoom.component.html',
  standalone: true,
})
export class ZoomControlComponent extends MapControlComponent {
  zoomIn() {
    this.mapCache.getMap(this.mapId()).zoomIn();
  }

  zoomOut() {
    this.mapCache.getMap(this.mapId()).zoomOut();
  }
}
