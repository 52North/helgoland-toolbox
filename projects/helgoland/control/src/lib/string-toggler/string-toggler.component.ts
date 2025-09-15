import { NgClass } from '@angular/common';
import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'n52-string-toggler',
  templateUrl: './string-toggler.component.html',
  imports: [NgClass],
})
export class StringTogglerComponent implements OnChanges {
  readonly value = input<string>();

  readonly option = input<string>();

  readonly icon = input<string>();

  readonly tooltip = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onToggled = output<string>();

  isToggled: boolean | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.isToggled = this.option() === this.value();
    }
  }

  toggle() {
    const option = this.option();
    if (option) {
      this.onToggled.emit(option);
    }
  }
}
