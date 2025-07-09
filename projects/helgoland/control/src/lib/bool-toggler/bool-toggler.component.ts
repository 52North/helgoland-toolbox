import { NgClass } from '@angular/common';
import { Component, output, input } from '@angular/core';

@Component({
  selector: 'n52-bool-toggler',
  templateUrl: './bool-toggler.component.html',
  imports: [NgClass],
})
export class BoolTogglerComponent {
  public readonly value = input<boolean>();

  public readonly icon = input<string>();

  public readonly tooltip = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onToggled = output<boolean>();

  public toggle() {
    this.onToggled.emit(!this.value());
  }
}
