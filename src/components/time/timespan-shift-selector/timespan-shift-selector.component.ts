import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Timespan } from './../../../model/internal/timeInterval';
import { Time } from './../../../services/time/time.service';

@Component({
    selector: 'n52-timespan-shift-selector',
    templateUrl: './timespan-shift-selector.component.html'
})
export class TimespanShiftSelectorComponent {

    @Input()
    public timespan: Timespan;

    @Output()
    public onTimespanChange: EventEmitter<Timespan> = new EventEmitter<Timespan>();

    @Output()
    public onOpenTimeSettings: EventEmitter<void> = new EventEmitter();

    constructor(
        private timeSrvc: Time
    ) { }

    public back() {
        this.onTimespanChange.emit(this.timeSrvc.stepBack(this.timespan));
    }

    public forward() {
        this.onTimespanChange.emit(this.timeSrvc.stepForward(this.timespan));
    }

    public open() {
        this.onOpenTimeSettings.emit();
    }
}
