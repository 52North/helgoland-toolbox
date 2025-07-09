import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  output,
} from '@angular/core';

@Component({
  selector: 'n52-string-toggler',
  templateUrl: './string-toggler.component.html',
  imports: [NgClass],
})
export class StringTogglerComponent implements OnChanges {
  @Input()
  public value: string | undefined;

  @Input()
  public option: string | undefined;

  @Input()
  public icon: string | undefined;

  @Input()
  public tooltip: string | undefined;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onToggled = output<string>();

  public isToggled: boolean | undefined;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.isToggled = this.option === this.value;
    }
  }

  public toggle() {
    if (this.option) {
      this.onToggled.emit(this.option);
    }
  }
}
