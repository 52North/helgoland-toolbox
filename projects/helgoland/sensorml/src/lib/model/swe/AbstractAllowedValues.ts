// @ts-nocheck
import { AbstractSWE } from './AbstractSWE';
import { DisplayName } from '../../common/decorators/DisplayName';

export class AbstractAllowedValues extends AbstractSWE {
  @DisplayName('Values')
  values: any[];

  override toString() {
    return 'Abstract allowed values';
  }
}
