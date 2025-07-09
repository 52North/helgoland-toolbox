import { Component, inject, output, input } from '@angular/core';
import {
  DefinedTimespan,
  DefinedTimespanService,
  Timespan,
} from '@helgoland/core';

@Component({
  selector: 'n52-timespan-button',
  templateUrl: './timespan-button.component.html',
  standalone: true,
})
export class TimespanButtonComponent {
  protected predefinedSrvc = inject(DefinedTimespanService);

  public readonly predefined = input.required<string | DefinedTimespan>();

  public readonly label = input.required<string>();

  public readonly timespanFunc = input.required<() => Timespan>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimespanSelected = output<Timespan>();

  public clicked() {
    const predefined = this.predefined();
    if (predefined) {
      this.onTimespanSelected.emit(
        this.predefinedSrvc.getInterval(predefined as DefinedTimespan),
      );
      return;
    }
    const timespanFunc = this.timespanFunc();
    if (timespanFunc) {
      this.onTimespanSelected.emit(timespanFunc());
      return;
    }
  }
}
