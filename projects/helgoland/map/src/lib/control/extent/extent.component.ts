import { Component, Input } from '@angular/core';

import { MapCache } from '../../base/map-cache.service';

@Component({
  selector: 'n52-extent-control',
  templateUrl: './extent.component.html'
})
export class ExtentControlComponent {

  @Input()
  public mapId: string;

  @Input()
  public extent: L.LatLngBoundsExpression;

  constructor(
    protected mapCache: MapCache
  ) { }

  public zoomToExtent() {
    this.mapCache.getMap(this.mapId).fitBounds(this.extent);
  }

}
