import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'n52-time-list-selector',
  templateUrl: './time-list-selector.component.html'
})
export class TimeListSelectorComponent {

  @Input()
  public timeList: number[];

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTimeSelected: EventEmitter<number> = new EventEmitter();

  public selectTime(timestamp: number) {
    this.onTimeSelected.emit(timestamp);
  }

}
