import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { MatMenuTrigger } from '@angular/material/menu';
import { DefinedTimespan, DefinedTimespanService, Time, Timespan } from '@helgoland/core';

@Component({
  selector: 'helgoland-general-time-selection',
  templateUrl: './general-time-selection.component.html',
  styleUrls: ['./general-time-selection.component.scss']
})
export class GeneralTimeSelectionComponent {

  public LASTHOUR = DefinedTimespan.LASTHOUR;
  public TODAY = DefinedTimespan.TODAY;
  public YESTERDAY = DefinedTimespan.YESTERDAY
  public TODAY_YESTERDAY = DefinedTimespan.TODAY_YESTERDAY
  public CURRENT_WEEK = DefinedTimespan.CURRENT_WEEK;
  public LAST_WEEK = DefinedTimespan.LAST_WEEK;
  public CURRENT_MONTH = DefinedTimespan.CURRENT_MONTH;
  public LAST_MONTH = DefinedTimespan.LAST_MONTH;
  public CURRENT_YEAR = DefinedTimespan.CURRENT_YEAR;
  public LAST_YEAR = DefinedTimespan.LAST_YEAR;

  public range: FormGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  @ViewChild('picker') picker: MatDateRangePicker<Date>;

  @Input() timespan: Timespan;

  @Output() timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  constructor(
    protected timeSrvc: Time,
    protected definedTimeSrvc: DefinedTimespanService
  ) { }

  back() {
    this.timespanChanged.emit(this.timeSrvc.stepBack(this.timespan));
  }

  forward() {
    this.timespanChanged.emit(this.timeSrvc.stepForward(this.timespan));
  }

  predefinedRange(defined: DefinedTimespan) {
    const timespan = this.definedTimeSrvc.getInterval(defined);
    if (timespan) {
      this.timespanChanged.emit(timespan);
    }
  }

  onMenuOpen() {
    this.range.setValue({ start: new Date(this.timespan.from), end: new Date(this.timespan.to) })
    this.picker.closedStream.subscribe(res => {
      const ts = new Timespan(this.range.value.start.toDate(), this.range.value.end.toDate());
      this.timespanChanged.emit(ts);
      this.trigger.closeMenu();
    });
  }

}
