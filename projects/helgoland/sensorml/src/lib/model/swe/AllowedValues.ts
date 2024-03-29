import { AbstractNumericAllowedValues } from './AbstractNumericAllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Defines the permitted values for the component as an enumerated list and/or
 * a list of inclusive ranges
 */
export class AllowedValues extends AbstractNumericAllowedValues {
  @DisplayName('Values')
  override values: Array<number | [number, number]> = [];

  override toString() {
    return 'Allowed values';
  }
}
