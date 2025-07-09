import { Component, Input, output } from '@angular/core';
import { TzDatePipe } from '@helgoland/core';

@Component({
  selector: 'n52-time-list-selector',
  templateUrl: './time-list-selector.component.html',
  imports: [TzDatePipe],
})
export class TimeListSelectorComponent {
  @Input({ required: true })
  public timeList!: number[];

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimeSelected = output<number>();

  public selectTime(timestamp: number) {
    this.onTimeSelected.emit(timestamp);
  }
}
