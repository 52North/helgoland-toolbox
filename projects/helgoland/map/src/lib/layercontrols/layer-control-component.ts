import { Directive, Input } from '@angular/core';

import { LayerOptions } from '../base/map-options';

@Directive()
export abstract class LayerControlComponent {
  @Input({ required: true })
  public layeroptions!: LayerOptions;

  @Input({ required: true })
  public mapId!: string;
}
