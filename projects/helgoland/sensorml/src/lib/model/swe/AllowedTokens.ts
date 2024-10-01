import { DisplayName } from '../../common/decorators/DisplayName';
import { AbstractAllowedValues } from './AbstractAllowedValues';

/**
 * Defines permitted values for the component, as an enumerated list of tokens
 * or a regular expression pattern
 */
export class AllowedTokens extends AbstractAllowedValues {
  @DisplayName('Values')
  override values: string[] = [];

  @DisplayName('Pattern')
  pattern = '';

  override toString() {
    return 'Allowed tokens';
  }
}
