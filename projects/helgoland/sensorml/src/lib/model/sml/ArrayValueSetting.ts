// @ts-nocheck
import { AbstractSetting } from './AbstractSetting';
import { SweEncoding } from '../swe/SweEncoding';
import { EncodedValues } from '../swe/EncodedValues';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ArrayValueSetting extends AbstractSetting {
  @DisplayName('Encoding')
  encoding: SweEncoding;

  @DisplayName('Encoded values')
  override value: EncodedValues;

  override toString() {
    return 'Array value setting';
  }
}
