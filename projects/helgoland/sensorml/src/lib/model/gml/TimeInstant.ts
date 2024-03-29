// @ts-nocheck
import { AbstractTime } from './AbstractTime';
import { DisplayName } from '../../common/decorators/DisplayName';

export class TimeInstant extends AbstractTime {
  @DisplayName('Time')
  time: Date;

  override toString() {
    return 'Time instant';
  }

  getLabel() {
    return this.toString();
  }

  getValue() {
    if (this.time) {
      return this.time.toLocaleDateString().replace(/ /g, '\xa0');
    }
    return this.toString();
  }
}
