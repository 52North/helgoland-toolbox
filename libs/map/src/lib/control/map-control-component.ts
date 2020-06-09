import { Input } from '@angular/core';
import { Required } from '@helgoland/core';

import { MapCache } from '../base/map-cache.service';

export abstract class MapControlComponent {

    /**
     * Connect map id.
     */
    @Input() @Required public mapId: string;

    constructor(
        protected mapCache: MapCache
    ) { }

}
