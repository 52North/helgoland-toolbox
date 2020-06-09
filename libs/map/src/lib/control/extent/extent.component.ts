import { Component, Input } from '@angular/core';

import { MapCache } from '../../base/map-cache.service';
import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-extent-control',
  templateUrl: './extent.component.html'
})
export class ExtentControlComponent extends MapControlComponent {

  @Input()
  public mapId: string;

  @Input()
  public extent: L.LatLngBoundsExpression;

  constructor(
    protected mapCache: MapCache
  ) {
    super(mapCache);
  }

  public zoomToExtent() {
    this.mapCache.getMap(this.mapId).fitBounds(this.extent);
  }

}
