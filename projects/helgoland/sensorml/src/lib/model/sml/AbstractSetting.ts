// @ts-nocheck
import { DisplayName } from '../../common/decorators/DisplayName';

export abstract class AbstractSetting {
  @DisplayName('Value')
  value: any;

  @DisplayName('Ref')
  ref: string;

  toString() {
    return 'Abstract setting';
  }
}
