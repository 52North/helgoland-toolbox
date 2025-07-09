import { NgClass } from '@angular/common';
import {
  Component,
  OnChanges,
  SimpleChanges,
  output,
  input,
} from '@angular/core';

@Component({
  selector: 'n52-string-toggler',
  templateUrl: './string-toggler.component.html',
  imports: [NgClass],
})
export class StringTogglerComponent implements OnChanges {
  public readonly value = input<string>();

  public readonly option = input<string>();

  public readonly icon = input<string>();

  public readonly tooltip = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onToggled = output<string>();

  public isToggled: boolean | undefined;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.isToggled = this.option() === this.value();
    }
  }

  public toggle() {
    const option = this.option();
    if (option) {
      this.onToggled.emit(option);
    }
  }
}
