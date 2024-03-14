import {
  Component,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'n52-string-toggler',
  templateUrl: './string-toggler.component.html',
  standalone: true,
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

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onToggled: EventEmitter<string> = new EventEmitter();

  public isToggled: boolean | undefined;

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.isToggled = this.option === this.value;
    }
  }

  public toggle() {
    this.onToggled.emit(this.option);
  }
}
