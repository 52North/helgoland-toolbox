import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Time, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-auto-update-timespan',
  templateUrl: './auto-update-timespan.component.html',
  styleUrls: ['./auto-update-timespan.component.css']
})
export class AutoUpdateTimespanComponent implements OnInit {

  @Input()
  public timeInterval: number; // timeinterval in milliseconds to be added to current timespan

  @Input()
  public currentTimespan: Timespan; // current Timespan to calculate new timespan

  @Input()
  public refreshInterval: number; // refresh interval in seconds

  @Output()
  public onChangeTimespan: EventEmitter<Timespan> = new EventEmitter();

  public toggleAutoUpdate = false;
  private timer = false;

  constructor(
    protected timeSrvc: Time
  ) { }

  ngOnInit() {
  }

  public toggleUpdateTimeinterval() {
    this.toggleAutoUpdate = !this.toggleAutoUpdate;
    this.startTimer();
  }

  public updateTimespan() {
    this.onChangeTimespan.emit(this.timeSrvc.stepForwardCustom(this.currentTimespan, this.timeInterval));
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
