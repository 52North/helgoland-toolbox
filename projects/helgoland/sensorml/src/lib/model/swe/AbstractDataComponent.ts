// @ts-nocheck
import { AbstractSWEIdentifiable } from './AbstractSWEIdentifiable';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Abstract base class for all data components
 */
export abstract class AbstractDataComponent extends AbstractSWEIdentifiable {
  /**
   * Reference to semantic information defining the precise nature of the
   * component
   */
  @DisplayName('Definition')
  definition: string;
  /**
   * Specifies that data for this component can be omitted in the datastream
   */
  @DisplayName('Optional')
  optional: boolean;
  /**
   * Specifies if the value of a data component can be updated externally
   * (i.e. is variable)
   */
  @DisplayName('Updatable')
  updatable: boolean;

  override toString(fallbackLabel = 'Abstract data component') {
    return super.toString(fallbackLabel);
  }

  public getLabel() {
    return this.label;
  }

  abstract getValue();
}
