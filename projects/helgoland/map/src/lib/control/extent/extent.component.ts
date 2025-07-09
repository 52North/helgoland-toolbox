import { Component, input } from '@angular/core';

import { MapControlComponent } from '../map-control-component';

@Component({
  selector: 'n52-extent-control',
  templateUrl: './extent.component.html',
  standalone: true,
})
export class ExtentControlComponent extends MapControlComponent {
  public readonly extent = input.required<L.LatLngBoundsExpression>();

  public zoomToExtent() {
    this.mapCache.getMap(this.mapId()).fitBounds(this.extent());
  }
}
