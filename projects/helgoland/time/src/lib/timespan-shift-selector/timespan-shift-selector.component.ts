import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Time, Timespan, TzDatePipe } from '@helgoland/core';

@Component({
  selector: 'n52-timespan-shift-selector',
  templateUrl: './timespan-shift-selector.component.html',
  imports: [TzDatePipe],
})
export class TimespanShiftSelectorComponent {
  protected timeSrvc = inject(Time);

  @Input({ required: true })
  public timespan!: Timespan;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimespanChange: EventEmitter<Timespan> =
    new EventEmitter<Timespan>();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onOpenTimeSettings: EventEmitter<void> = new EventEmitter();

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
