import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DefinedTimespan, DefinedTimespanService, Timespan } from '@helgoland/core';

@Component({
  selector: 'n52-timespan-button',
  templateUrl: './timespan-button.component.html'
})
export class TimespanButtonComponent {

  @Input()
  public predefined: string | DefinedTimespan;

  @Input()
  public label: string;

  @Input()
  public timespanFunc: () => Timespan;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output()
  public onTimespanSelected: EventEmitter<Timespan> = new EventEmitter();

  constructor(
    protected predefinedSrvc: DefinedTimespanService
  ) { }

  public clicked() {
    if (this.predefined) {
      this.onTimespanSelected.emit(this.predefinedSrvc.getInterval(this.predefined as DefinedTimespan));
      return;
    }
    if (this.timespanFunc) {
      this.onTimespanSelected.emit(this.timespanFunc());
      return;
    }
    this.onTimespanSelected.emit();
  }

}