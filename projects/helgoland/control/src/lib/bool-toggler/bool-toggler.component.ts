import { NgClass } from '@angular/common';
import { Component, Input, output } from '@angular/core';

@Component({
  selector: 'n52-bool-toggler',
  templateUrl: './bool-toggler.component.html',
  imports: [NgClass],
})
export class BoolTogglerComponent {
  @Input()
  public value: boolean | undefined;

  @Input()
  public icon: string | undefined;

  @Input()
  public tooltip: string | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public readonly onToggled = output<boolean>();

  public toggle() {
    this.onToggled.emit(!this.value);
  }
}
