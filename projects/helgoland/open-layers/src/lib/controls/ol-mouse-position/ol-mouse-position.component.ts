import { Component, ElementRef, Host, Input } from "@angular/core";
import { Map } from "ol";
import { MousePosition } from "ol/control";
import { createStringXY } from "ol/coordinate";

import { OlBaseComponent } from "../../ol-base.component";
import { OlMapService } from "../../services/map.service";
import { OlMapId } from "../../services/mapid.service";

/**
 * Control component to show the coordinates at the mouse position
 */
@Component({
  selector: "n52-ol-mouse-position",
  template: "",
  standalone: true
})
export class OlMousePositionComponent extends OlBaseComponent {

  @Input() projection = "EPSG:3857";

  constructor(
    protected override mapService: OlMapService,
    @Host() protected override mapidService: OlMapId,
    private elementRef: ElementRef
  ) {
    super(mapService, mapidService);
  }

  mapInitialized(map: Map) {
    const target = this.elementRef.nativeElement.parentElement ? this.elementRef.nativeElement : null;
    const ctrl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: this.projection,
      undefinedHTML: "&nbsp;",
      target: target
    });
    map.addControl(ctrl);
  }

}
