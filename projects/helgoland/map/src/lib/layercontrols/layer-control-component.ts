import { Directive, Input } from '@angular/core';

import { LayerOptions } from '../base/map-options';

@Directive()
export abstract class LayerControlComponent {

    @Input() public layeroptions: LayerOptions;

    @Input() public mapId: string;

}
