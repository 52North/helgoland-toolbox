import { Directive, Input } from '@angular/core';

import { MapCache } from '../base/map-cache.service';

@Directive()
export abstract class MapControlComponent {
  /**
   * Connect map id.
   */
  @Input({ required: true }) public mapId!: string;

  constructor(protected mapCache: MapCache) {}
}
