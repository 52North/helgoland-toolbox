import { AbstractNumericAllowedValues } from './AbstractNumericAllowedValues';
import { TimePosition } from './TimePosition';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Defines the permitted values for the component, as a time range or an
 * enumerated list of time values
 */
export class AllowedTimes extends AbstractNumericAllowedValues {
  @DisplayName('Values')
  override values: Array<TimePosition | [TimePosition, TimePosition]> = [];

  override toString() {
    return 'Allowed times';
  }
}
