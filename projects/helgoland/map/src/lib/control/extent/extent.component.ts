import { Component, Input } from '@angular/core';
import { Required } from '@helgoland/core';

import { MapCache } from '../../base/map-cache.service';
import { MapControlComponent } from '../map-control-component';

@Component({
    selector: 'n52-extent-control',
    templateUrl: './extent.component.html',
    standalone: true
})
export class ExtentControlComponent extends MapControlComponent {

  @Input()
  @Required
  public extent!: L.LatLngBoundsExpression;

  constructor(
    protected override mapCache: MapCache
  ) {
    super(mapCache);
  }

  public zoomToExtent() {
    this.mapCache.getMap(this.mapId).fitBounds(this.extent);
  }

}
