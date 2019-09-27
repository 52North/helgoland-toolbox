import { Component, ElementRef, Host } from '@angular/core';
import { Map } from 'ol';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';

import { OlBaseComponent } from '../../ol-base.component';
import { OlMapService } from '../../services/map.service';
import { OlMapId } from '../../services/mapid.service';

/**
 * Control component to show the coordinates at the mouse position
 */
@Component({
  selector: 'n52-ol-mouse-position',
  template: '',
})
export class OlMousePositionComponent extends OlBaseComponent {

  constructor(
    protected mapService: OlMapService,
    @Host() protected mapidService: OlMapId,
    private elementRef: ElementRef
  ) {
    super(mapService, mapidService);
  }

  mapInitialized(map: Map) {
    const target = this.elementRef.nativeElement.parentElement ? this.elementRef.nativeElement : null;
    const ctrl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: 'EPSG:4326',
      undefinedHTML: '&nbsp;',
      target: target
    });
    map.addControl(ctrl);
  }

}
