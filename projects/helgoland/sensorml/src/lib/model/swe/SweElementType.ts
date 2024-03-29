// @ts-nocheck
import { AbstractDataComponent } from './AbstractDataComponent';
import { DisplayName } from '../../common/decorators/DisplayName';

export class SweElementType {
  @DisplayName('Name')
  name: string;

  @DisplayName('Type')
  type: AbstractDataComponent;

  toString() {
    return this.name || 'SWE element type';
  }
}
