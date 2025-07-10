import { Directive, inject, input } from '@angular/core';

import { MapCache } from '../base/map-cache.service';

@Directive()
export abstract class MapControlComponent {
  protected mapCache = inject(MapCache);

  /**
   * Connect map id.
   */
  readonly mapId = input.required<string>();
}
