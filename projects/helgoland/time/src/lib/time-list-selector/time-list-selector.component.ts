import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TzDatePipe } from "@helgoland/core";

@Component({
  selector: "n52-time-list-selector",
  templateUrl: "./time-list-selector.component.html",
  standalone: true,
  imports: [TzDatePipe]
})
export class TimeListSelectorComponent {

  @Input({ required: true })
  public timeList!: number[];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimeSelected: EventEmitter<number> = new EventEmitter();

  public selectTime(timestamp: number) {
    this.onTimeSelected.emit(timestamp);
  }

}
