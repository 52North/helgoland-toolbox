import { Directive, Input } from '@angular/core';
import { Required } from '@helgoland/core';

import { LayerOptions } from '../base/map-options';

@Directive()
export abstract class LayerControlComponent {

    @Input()
    @Required
    public layeroptions!: LayerOptions;

    @Input()
    @Required
    public mapId!: string;

}
