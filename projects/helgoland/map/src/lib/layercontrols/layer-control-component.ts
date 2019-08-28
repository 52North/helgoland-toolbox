import { Input } from '@angular/core';

import { LayerOptions } from '../base/map-options';

export abstract class LayerControlComponent {

    @Input() public layeroptions: LayerOptions;

    @Input() public mapId: string;

}
