import { AbstractMetadataList } from './AbstractMetadataList';
import { ResponsibleParty } from '../iso/gmd/ResponsibleParty';
import { DisplayName } from '../../common/decorators/DisplayName';

export class ContactList extends AbstractMetadataList {
  @DisplayName('Contacts')
  contacts: ResponsibleParty[] = [];

  override toString() {
    return 'Contact list';
  }

  getLabel() {
    return this.toString();
  }

  getValue() {
    if (this.contacts.length > 0) {
      return this.contacts.join(', ');
    }
    return undefined;
  }
}
