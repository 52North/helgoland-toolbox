// @ts-nocheck
import { AbstractSimpleComponent } from './AbstractSimpleComponent';
import { AllowedValues } from './AllowedValues';
import { UnitOfMeasure } from './UnitOfMeasure';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Scalar component with decimal representation and a unit of measure used to
 * store value of a continuous quantity
 */
export class SweQuantity extends AbstractSimpleComponent {
  /**
   * Value is optional, to enable structure to act as a schema for values
   * provided using other encodings
   */
  @DisplayName('Value')
  override value: number;
  /**
   * Unit of measure used to express the value of this data component
   */
  @DisplayName('Unit of measure')
  uom: UnitOfMeasure = new UnitOfMeasure();

  @DisplayName('Constraint')
  override constraint: AllowedValues = new AllowedValues();

  override toString() {
    return 'Quantity Component';
  }

  getValue() {
    return this.value;
  }
}
