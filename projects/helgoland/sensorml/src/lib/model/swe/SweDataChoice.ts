import { AbstractDataComponent } from './AbstractDataComponent';
import { SweCategory } from './SweCategory';
import { SweDataChoiceItem } from './SweDataChoiceItem';
import { DisplayName } from '../../common/decorators/DisplayName';

/**
 * Implementation of a choice of two or more Data Components (also called
 * disjoint union)
 */
export class SweDataChoice extends AbstractDataComponent {
  /**
   * This category component marks the data stream element that will indicate
   * the actual choice made. Possible choices are listed in the Category
   * constraint section as an enumeration and should map to item names.
   */
  @DisplayName('Choice value')
  choiceValue: SweCategory[] = [];

  @DisplayName('Items')
  items: SweDataChoiceItem[] = [];

  override toString() {
    return super.toString('SWE data choice');
  }

  getValue() {
    return this.toString();
  }
}
