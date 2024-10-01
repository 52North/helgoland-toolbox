import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Time, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-auto-update-timespan',
  templateUrl: './auto-update-timespan.component.html',
  styleUrls: ['./auto-update-timespan.component.css'],
  standalone: true,
})
export class AutoUpdateTimespanComponent {
  /**
   * optional timeinterval in seconds to be added to current timespan. If not set, the refreshInterval is selected.
   */
  @Input()
  public timeInterval: number | undefined;

  /**
   * current Timespan to calculate new timespan
   */
  @Input({ required: true })
  public currentTimespan!: Timespan;

  /**
   * refresh interval in seconds
   */
  @Input({ required: true })
  public refreshInterval!: number;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onChangeTimespan: EventEmitter<Timespan> = new EventEmitter();

  public toggleAutoUpdate = false;
  private timer = false;

  constructor(protected timeSrvc: Time) {}

  public toggleUpdateTimeinterval() {
    this.toggleAutoUpdate = !this.toggleAutoUpdate;
    this.startTimer();
  }

  public updateTimespan() {
    const stepSeconds = this.timeInterval || this.refreshInterval;
    this.onChangeTimespan.emit(
      this.timeSrvc.stepForwardCustom(this.currentTimespan, stepSeconds * 1000),
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
        }, this.refreshInterval * 1000);
      }
    }
  }
}
