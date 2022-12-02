import { MapCache } from './../../base/map-cache.service';
import { Component } from '@angular/core';

import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-zoom-control',
  templateUrl: './zoom.component.html'
})
export class ZoomControlComponent extends MapControlComponent {

  constructor(
    protected override mapCache: MapCache
  ) {
    super(mapCache);
  }

  public zoomIn() {
    this.mapCache.getMap(this.mapId).zoomIn();
  }

  public zoomOut() {
    this.mapCache.getMap(this.mapId).zoomOut();
  }
}
