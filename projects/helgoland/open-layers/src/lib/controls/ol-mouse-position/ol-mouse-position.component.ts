import { Component, ElementRef, inject, input } from '@angular/core';
import { Map } from 'ol';
import { MousePosition } from 'ol/control';
import { createStringXY } from 'ol/coordinate';

import { OlBaseComponent } from '../../ol-base.component';

/**
 * Control component to show the coordinates at the mouse position
 */
@Component({
  selector: 'n52-ol-mouse-position',
  template: '',
  standalone: true,
})
export class OlMousePositionComponent extends OlBaseComponent {
  private elementRef = inject(ElementRef);

  readonly projection = input('EPSG:3857');

  mapInitialized(map: Map) {
    const target = this.elementRef.nativeElement.parentElement
      ? this.elementRef.nativeElement
      : null;
    const ctrl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: this.projection(),
      undefinedHTML: '&nbsp;',
      target: target,
    });
    map.addControl(ctrl);
  }
}
