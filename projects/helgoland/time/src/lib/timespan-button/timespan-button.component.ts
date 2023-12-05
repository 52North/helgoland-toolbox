import { Component, EventEmitter, Input, Output } from "@angular/core";
import { DefinedTimespan, DefinedTimespanService, Timespan } from "@helgoland/core";

@Component({
  selector: "n52-timespan-button",
  templateUrl: "./timespan-button.component.html",
  standalone: true
})
export class TimespanButtonComponent {

  @Input()
  public predefined!: string | DefinedTimespan;

  @Input({ required: true })
  public label!: string;

  @Input()
  public timespanFunc!: () => Timespan;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
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
