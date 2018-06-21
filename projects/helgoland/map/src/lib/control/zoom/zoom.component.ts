import { Component, Input } from '@angular/core';

import { MapCache } from '../../base/map-cache.service';

@Component({
  selector: 'n52-zoom-control',
  templateUrl: './zoom.component.html'
})
export class ZoomControlComponent {

  @Input()
  public mapId: string;

  constructor(
    protected mapCache: MapCache
  ) { }

  public zoomIn() {
    this.mapCache.getMap(this.mapId).zoomIn();
  }

  public zoomOut() {
    this.mapCache.getMap(this.mapId).zoomOut();
  }
}
