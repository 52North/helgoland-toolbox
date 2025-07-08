import { Component, Input } from '@angular/core';

import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-extent-control',
  templateUrl: './extent.component.html',
  standalone: true,
})
export class ExtentControlComponent extends MapControlComponent {
  @Input({ required: true })
  public extent!: L.LatLngBoundsExpression;

  public zoomToExtent() {
    this.mapCache.getMap(this.mapId).fitBounds(this.extent);
  }
}
