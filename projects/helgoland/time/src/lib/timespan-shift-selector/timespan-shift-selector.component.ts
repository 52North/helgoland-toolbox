import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Time, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-timespan-shift-selector',
  templateUrl: './timespan-shift-selector.component.html'
})
export class TimespanShiftSelectorComponent {

  @Input()
  public timespan: Timespan;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onOpenTimeSettings: EventEmitter<void> = new EventEmitter();

  constructor(
    protected timeSrvc: Time
  ) { }

  public back() {
    this.onTimespanChange.emit(this.timeSrvc.stepBack(this.timespan));
  }

  public forward() {
    this.onTimespanChange.emit(this.timeSrvc.stepForward(this.timespan));
  }

  public open() {
    this.onOpenTimeSettings.emit();
  }
}
