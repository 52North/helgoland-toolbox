// @ts-nocheck
import { AbstractSimpleComponent } from './AbstractSimpleComponent';
import { AllowedTokens } from './AllowedTokens';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Scalar component used to represent a categorical value as a simple token
 * identifying a term in a code space
 */
export class SweCategory extends AbstractSimpleComponent {
  /**
   * Value is optional, to enable structure to act as a schema for values
   * provided using other encodings
   */
  @DisplayName('Value')
  override value: string;
  /**
   * Name of the dictionary where the possible values for this component are
   * listed and defined
   */
  @DisplayName('Code space')
  codeSpace: string;

  @DisplayName('Constraint')
  override constraint: AllowedTokens = new AllowedTokens();

  override toString() {
    return 'Category Component';
  }

  getValue() {
    return this.value;
  }
}
