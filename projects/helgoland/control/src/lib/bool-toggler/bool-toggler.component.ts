import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'n52-bool-toggler',
  templateUrl: './bool-toggler.component.html',
  imports: [NgClass],
})
export class BoolTogglerComponent {
  readonly value = input<boolean>();

  readonly icon = input<string>();

  readonly tooltip = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onToggled = output<boolean>();

  toggle() {
    this.onToggled.emit(!this.value());
  }
}
