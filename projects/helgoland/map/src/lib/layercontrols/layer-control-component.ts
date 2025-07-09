import { Directive, input } from '@angular/core';

import { LayerOptions } from '../base/map-options';

@Directive()
export abstract class LayerControlComponent {
  public readonly layeroptions = input.required<LayerOptions>();

  public readonly mapId = input.required<string>();
}
