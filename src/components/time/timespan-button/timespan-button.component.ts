import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Timespan } from '../../../model/internal/timeInterval';
import { DefinedTimespan, DefinedTimespanService } from '../../../services/time/defined-timespan.service';

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

    @Output()
    public onTimespanSelected: EventEmitter<Timespan> = new EventEmitter();

    constructor(
        private predefinedSrvc: DefinedTimespanService
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
