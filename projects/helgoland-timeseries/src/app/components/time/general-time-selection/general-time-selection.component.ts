import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDateRangePicker } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DefinedTimespan, DefinedTimespanService, HelgolandCoreModule, Required, Time, Timespan } from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-general-time-selection',
  templateUrl: './general-time-selection.component.html',
  styleUrls: ['./general-time-selection.component.scss'],
  imports: [
    CommonModule,
    HelgolandCoreModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatMomentDateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  standalone: true
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

  public range: UntypedFormGroup = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl()
  });

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;

  @Input() @Required timespan!: Timespan;

  @Output() timespanChanged: EventEmitter<Timespan> = new EventEmitter();

  constructor(
    protected timeSrvc: Time,
    protected definedTimeSrvc: DefinedTimespanService
  ) { }

  back() {
    this.timespanChanged.emit(this.timeSrvc.stepBack(this.timespan!));
  }

  forward() {
    this.timespanChanged.emit(this.timeSrvc.stepForward(this.timespan!));
  }

  predefinedRange(defined: DefinedTimespan) {
    const timespan = this.definedTimeSrvc.getInterval(defined);
    if (timespan) {
      this.timespanChanged.emit(timespan);
    }
  }

  onMenuOpen(picker: MatDateRangePicker<Date>) {
    this.range.setValue({ start: new Date(this.timespan!.from), end: new Date(this.timespan!.to) })
    picker.closedStream.subscribe(res => {
      const ts = new Timespan(this.range.value.start.toDate(), this.range.value.end.toDate());
      this.timespanChanged.emit(ts);
      this.trigger!.closeMenu();
    });
  }

}
