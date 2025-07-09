import { Component, Input, inject, output } from '@angular/core';
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

  @Input()
  public predefined!: string | DefinedTimespan;

  @Input({ required: true })
  public label!: string;

  @Input()
  public timespanFunc!: () => Timespan;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimespanSelected = output<Timespan>();

  public clicked() {
    if (this.predefined) {
      this.onTimespanSelected.emit(
        this.predefinedSrvc.getInterval(this.predefined as DefinedTimespan),
      );
      return;
    }
    if (this.timespanFunc) {
      this.onTimespanSelected.emit(this.timespanFunc());
      return;
    }
  }
}
