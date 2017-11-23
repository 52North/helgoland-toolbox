import { Component } from '@angular/core';

import { PlotOptions } from '../../../../../src/components/graph/flot/model';
import { DatasetOptions } from './../../../../../src/model/internal/options';
import { Timespan } from './../../../../../src/model/internal/timeInterval';

@Component({
    selector: 'my-app',
    templateUrl: './flot-graph.component.html',
    styleUrls: ['./flot-graph.component.css']
})
export class FlotGraphComponent {

    public datasetIds = ['http://www.fluggs.de/sos2/api/v1/__63'];
    public datasetIdsOne = ['http://www.fluggs.de/sos2/api/v1/__72'];
    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public diagramOptions: PlotOptions = {
        crosshair: {
            mode: 'x'
        },
        pan: {
            frameRate: 10,
            interactive: true
        },
        touch: {
            delayTouchEnded: 200,
            pan: 'x',
            scale: ''
        },
        yaxis: {
            additionalWidth: 17,
            labelWidth: 50,
            min: null,
            panRange: false,
            show: true,
        }
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();

    constructor() {
        this.datasetIds.forEach((entry) => {
            this.datasetOptions.set(entry, new DatasetOptions(entry, '#123456'));
        });
        this.datasetIdsOne.forEach((entry) => {
            this.datasetOptionsOne.set(entry, new DatasetOptions(entry, '#FF0000'));
        });
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }
}
