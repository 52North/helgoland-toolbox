import { Component, inject, input, output } from '@angular/core';
import { Time, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-auto-update-timespan',
  templateUrl: './auto-update-timespan.component.html',
  styleUrls: ['./auto-update-timespan.component.css'],
  standalone: true,
})
export class AutoUpdateTimespanComponent {
  protected timeSrvc = inject(Time);

  /**
   * optional timeinterval in seconds to be added to current timespan. If not set, the refreshInterval is selected.
   */
  readonly timeInterval = input<number>();

  /**
   * current Timespan to calculate new timespan
   */
  readonly currentTimespan = input.required<Timespan>();

  /**
   * refresh interval in seconds
   */
  readonly refreshInterval = input.required<number>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onChangeTimespan = output<Timespan>();

  toggleAutoUpdate = false;
  private timer = false;

  toggleUpdateTimeinterval() {
    this.toggleAutoUpdate = !this.toggleAutoUpdate;
    this.startTimer();
  }

  updateTimespan() {
    const stepSeconds = this.timeInterval() || this.refreshInterval();
    this.onChangeTimespan.emit(
      this.timeSrvc.stepForwardCustom(
        this.currentTimespan(),
        stepSeconds * 1000,
      ),
    );
  }

  private startTimer() {
    if (this.toggleAutoUpdate) {
      if (!this.timer) {
        this.updateTimespan();
        this.timer = true;
        setTimeout(() => {
          this.timer = false;
          this.startTimer();
        }, this.refreshInterval() * 1000);
      }
    }
  }
}
