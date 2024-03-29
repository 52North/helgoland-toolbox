// @ts-nocheck
import { DescribedObject } from './DescribedObject';
import { Settings } from './Settings';
import { DisplayName } from '../../common/decorators/DisplayName';

export class Mode extends DescribedObject {
  @DisplayName('Configuration')
  configuration: Settings = null;

  override toString() {
    return 'Mode';
  }
}
