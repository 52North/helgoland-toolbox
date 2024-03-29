import { AbstractSweRange } from './AbstractSweRange';
import { UnitOfMeasure } from './UnitOfMeasure';
import { AllowedValues } from './AllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Decimal pair for specifying a quantity range with a unit of measure
 */
export class SweQuantityRange extends AbstractSweRange {
  /**
   * Value is a pair of double numbers separated by a space. It is optional, to
   * enable structure to act as a schema for values provided using other
   * encodings
   */
  @DisplayName('Value')
  override value: [number, number] = [0, 0];
  /**
   * Unit of measure used to express the value of this data component
   */
  @DisplayName('Unit of measure')
  uom: UnitOfMeasure = new UnitOfMeasure();

  @DisplayName('Constraint')
  override constraint: AllowedValues = new AllowedValues();

  override toString() {
    return 'Quantity Range Component';
  }
}
