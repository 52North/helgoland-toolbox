// @ts-nocheck
import { AbstractSimpleComponent } from './AbstractSimpleComponent';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Scalar component used to express truth: True or False, 0 or 1
 */
export class SweBoolean extends AbstractSimpleComponent {
  /**
   * Value is optional, to enable structure to act as a schema for values
   * provided using other encodings
   */
  @DisplayName('Value')
  override value: boolean;

  override toString() {
    return 'Boolean Component';
  }

  getValue() {
    return this.value;
  }
}
