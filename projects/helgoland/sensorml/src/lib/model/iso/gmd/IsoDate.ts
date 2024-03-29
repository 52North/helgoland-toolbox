// @ts-nocheck
import { DateType } from './DateType';
import { DisplayName } from '../../../common/decorators/DisplayName';

export class IsoDate {
  @DisplayName('Type')
  type: DateType;

  @DisplayName('Date')
  date: Date;

  toString() {
    return this.date ? this.date.toISOString() : 'IsoDate';
  }
}
