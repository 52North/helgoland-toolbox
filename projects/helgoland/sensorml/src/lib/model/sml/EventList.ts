import { AbstractMetadataList } from './AbstractMetadataList';
import { Event } from './Event';
import { DisplayName } from '../../common/decorators/DisplayName';

export class EventList extends AbstractMetadataList {
  @DisplayName('Events')
  events: Event[] = [];

  override toString() {
    return 'Event list';
  }

  getLabel() {
    return this.toString();
  }

  getValue() {
    if (this.events.length > 0) {
      return this.events.join(', ');
    }
    return undefined;
  }
}
