// @ts-nocheck
import { DisplayName } from '../../common/decorators/DisplayName';
import { AbstractProcess } from '../sml';

export class Component {
  constructor(name?: string, href?: string) {
    this.name = name;
    this.href = href;
  }

  @DisplayName('Name')
  name: string;

  @DisplayName('Href')
  href: string;

  abstractProcess: AbstractProcess;

  toString() {
    return this.name || 'Component';
  }
}
