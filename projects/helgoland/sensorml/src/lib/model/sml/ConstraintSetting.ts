// @ts-nocheck
import { AbstractSetting } from './AbstractSetting';
import { AllowedTokens } from '../swe/AllowedTokens';
import { AllowedTimes } from '../swe/AllowedTimes';
import { AllowedValues } from '../swe/AllowedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ConstraintSetting extends AbstractSetting {
  @DisplayName('Value')
  override value: AllowedTokens | AllowedTimes | AllowedValues;

  override toString() {
    return 'Constraint setting';
  }
}
