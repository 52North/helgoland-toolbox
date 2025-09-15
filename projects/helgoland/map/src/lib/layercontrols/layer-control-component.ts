import { Directive, input } from '@angular/core';

import { LayerOptions } from '../base/map-options';

@Directive()
export abstract class LayerControlComponent {
  readonly layeroptions = input.required<LayerOptions>();

  readonly mapId = input.required<string>();
}
