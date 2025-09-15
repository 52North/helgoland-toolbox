import { Component, inject, input, output } from '@angular/core';
import { Time, Timespan, TzDatePipe } from '@helgoland/core';

@Component({
  selector: 'n52-timespan-shift-selector',
  templateUrl: './timespan-shift-selector.component.html',
  imports: [TzDatePipe],
})
export class TimespanShiftSelectorComponent {
  protected timeSrvc = inject(Time);

  readonly timespan = input.required<Timespan>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimespanChange = output<Timespan>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onOpenTimeSettings = output<void>();

  back() {
    this.onTimespanChange.emit(this.timeSrvc.stepBack(this.timespan()));
  }

  forward() {
    this.onTimespanChange.emit(this.timeSrvc.stepForward(this.timespan()));
  }

  open() {
    this.onOpenTimeSettings.emit();
  }
}
