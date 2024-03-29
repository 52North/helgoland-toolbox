// @ts-nocheck
import { AbstractDataComponent } from '../swe';
import { DisplayName } from '../../common/decorators/DisplayName';

export class NamedSweDataComponent {
  @DisplayName('Name')
  name = '';

  @DisplayName('Component')
  component: AbstractDataComponent;

  toString() {
    if (this.component.getLabel() && this.component.getValue()) {
      return this.component.getLabel() + ': ' + this.component.getValue();
    } else if (this.component.getLabel()) {
      return this.component.getValue();
    } else {
      return this.component.toString();
    }
  }
}
