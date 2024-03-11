import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Required, TzDatePipe } from '@helgoland/core';
import { NgFor } from '@angular/common';

@Component({
    selector: 'n52-time-list-selector',
    templateUrl: './time-list-selector.component.html',
    standalone: true,
    imports: [NgFor, TzDatePipe]
})
export class TimeListSelectorComponent {

  @Input()
  @Required
  public timeList!: number[];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimeSelected: EventEmitter<number> = new EventEmitter();

  public selectTime(timestamp: number) {
    this.onTimeSelected.emit(timestamp);
  }

}
