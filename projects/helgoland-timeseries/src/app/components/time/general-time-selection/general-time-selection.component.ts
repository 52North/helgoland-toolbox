import { Component, inject, input, output, viewChild } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDatepickerModule,
  MatDateRangePicker,
} from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DefinedTimespan,
  DefinedTimespanService,
  HelgolandCoreModule,
  Time,
  Timespan,
} from '@helgoland/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'helgoland-general-time-selection',
  templateUrl: './general-time-selection.component.html',
  styleUrls: ['./general-time-selection.component.scss'],
  imports: [
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
})
export class GeneralTimeSelectionComponent {
  protected timeSrvc = inject(Time);
  protected definedTimeSrvc = inject(DefinedTimespanService);

  LASTHOUR = DefinedTimespan.LASTHOUR;
  TODAY = DefinedTimespan.TODAY;
  YESTERDAY = DefinedTimespan.YESTERDAY;
  TODAY_YESTERDAY = DefinedTimespan.TODAY_YESTERDAY;
  CURRENT_WEEK = DefinedTimespan.CURRENT_WEEK;
  LAST_WEEK = DefinedTimespan.LAST_WEEK;
  CURRENT_MONTH = DefinedTimespan.CURRENT_MONTH;
  LAST_MONTH = DefinedTimespan.LAST_MONTH;
  CURRENT_YEAR = DefinedTimespan.CURRENT_YEAR;
  LAST_YEAR = DefinedTimespan.LAST_YEAR;

  range: UntypedFormGroup = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });

  readonly trigger = viewChild(MatMenuTrigger);

  readonly timespan = input.required<Timespan>();

  readonly timespanChanged = output<Timespan>();

  back() {
    this.timespanChanged.emit(this.timeSrvc.stepBack(this.timespan()!));
  }

  forward() {
    this.timespanChanged.emit(this.timeSrvc.stepForward(this.timespan()!));
  }

  predefinedRange(defined: DefinedTimespan) {
    const timespan = this.definedTimeSrvc.getInterval(defined);
    if (timespan) {
      this.timespanChanged.emit(timespan);
    }
  }

  onMenuOpen(picker: MatDateRangePicker<Date>) {
    this.range.setValue({
      start: new Date(this.timespan()!.from),
      end: new Date(this.timespan()!.to),
    });
    picker.closedStream.subscribe((res) => {
      const ts = new Timespan(
        this.range.value.start.toDate(),
        this.range.value.end.toDate(),
      );
      this.timespanChanged.emit(ts);
      this.trigger()!.closeMenu();
    });
  }
}
