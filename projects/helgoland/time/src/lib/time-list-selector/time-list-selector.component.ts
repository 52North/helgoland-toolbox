import { Component, output, input } from '@angular/core';
import { TzDatePipe } from '@helgoland/core';

@Component({
  selector: 'n52-time-list-selector',
  templateUrl: './time-list-selector.component.html',
  imports: [TzDatePipe],
})
export class TimeListSelectorComponent {
  public readonly timeList = input.required<number[]>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimeSelected = output<number>();

  public selectTime(timestamp: number) {
    this.onTimeSelected.emit(timestamp);
  }
}
