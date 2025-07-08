import { Directive, Input, inject } from '@angular/core';

import { MapCache } from '../base/map-cache.service';

@Directive()
export abstract class MapControlComponent {
  protected mapCache = inject(MapCache);

  /**
   * Connect map id.
   */
  @Input({ required: true }) public mapId!: string;
}
