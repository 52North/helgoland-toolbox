import { Component } from '@angular/core';
import { Timespan, DatasetOptions } from '@helgoland/core';
import { PlotOptions } from '@helgoland/flot/src/flot';

@Component({
    selector: 'my-app',
    templateUrl: './flot-graph.component.html',
    styleUrls: ['./flot-graph.component.css']
})
export class FlotGraphComponent {

    public datasetIds = ['http://www.fluggs.de/sos2/api/v1/__63'];
    public datasetIdsOne = ['http://www.fluggs.de/sos2/api/v1/__72'];
    // public datasetIdsMultiple = ['http://www.fluggs.de/sos2/api/v1/__63', 'http://www.fluggs.de/sos2/api/v1/__72','http://www.fluggs.de/sos2/api/v1/__63'];
    // public colors = [ '#123456' , '#FF0000', '#654321' ];
    public datasetIdsMultiple = ['http://www.fluggs.de/sos2/api/v1/__63', 'http://www.fluggs.de/sos2/api/v1/__72'];
    public colors = [ '#123456' , '#FF0000' ];

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
    public diagramOptionsD3: PlotOptions = {
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
        },
        togglePanZoom: false
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
    public panZoom: any = "zoom";

    constructor() {
        this.datasetIds.forEach((entry) => {
            this.datasetOptions.set(entry, new DatasetOptions(entry, '#123456'));
        });
        this.datasetIdsOne.forEach((entry) => {
            this.datasetOptionsOne.set(entry, new DatasetOptions(entry, '#FF0000'));
        });

        this.datasetIdsMultiple.forEach((entry, i) => {
            this.datasetOptionsMultiple.set(entry, new DatasetOptions(entry, this.colors[i]));
        });
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    public togglePanZoom() {
        this.diagramOptionsD3.togglePanZoom = !this.diagramOptionsD3.togglePanZoom;
        this.panZoom = this.diagramOptionsD3.togglePanZoom === true ? "pan" : "zoom";
    }
}
