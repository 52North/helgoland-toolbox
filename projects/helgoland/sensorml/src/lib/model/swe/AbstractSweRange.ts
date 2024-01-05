// @ts-nocheck
import { AbstractSimpleComponent } from './AbstractSimpleComponent';
import { DisplayName } from '../../common/decorators/DisplayName';

export class AbstractSweRange extends AbstractSimpleComponent {
  @DisplayName('Value')
  override value: [any, any];

  override toString(fallbackLabel = 'Abstract SWE range') {
    return super.toString(fallbackLabel);
  }

  getValue() {
    return this.value[0].toString() + ' - ' + this.value[1].toString();
  }
}
