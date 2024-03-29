import { AbstractSWE } from '../swe/AbstractSWE';
import { Output } from './Output';
import { DisplayName } from '../../common/decorators/DisplayName';

export class OutputList extends AbstractSWE {
  @DisplayName('Outputs')
  outputs: Output[] = [];

  override toString() {
    return 'Output list';
  }
}
