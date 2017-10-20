import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Settings } from '../../../services/settings/settings';

@Component({
    selector: 'n52-timeseries-style-selector',
    templateUrl: './timeseries-style-selector.component.html',
    styleUrls: ['./timeseries-style-selector.component.scss']
})
export class TimeseriesStyleSelectorComponent implements OnInit {

    @Input()
    public timeseriesColor: string;

    @Output()
    public onColorChange: EventEmitter<string> = new EventEmitter<string>();

    public timeseriesColorRamp: string[];

    constructor(private settingSrvc: Settings) { }

    public ngOnInit() {
        this.timeseriesColorRamp = this.settingSrvc.config.colorList;
    }
}
