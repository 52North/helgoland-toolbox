import { Component } from '@angular/core';

import { DatasetOptions, PlotOptions, Timespan, TimedDatasetOptions } from '../../lib';

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    public profileDatasetIds = ['http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12'];
    public profileDatasetOptions: Map<string, TimedDatasetOptions[]> = new Map();

    public datasetIds = ['http://www.fluggs.de/sos2/api/v1/__63'];
    public datasetIdsOne = ['http://www.fluggs.de/sos2/api/v1/__72'];
    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public diagramOptions: PlotOptions = {
        crosshair: {
            mode: 'x'
        },
        grid: {
            autoHighlight: true,
            hoverable: true
        },
        legend: {
            show: false
        },
        pan: {
            frameRate: 10,
            interactive: true
        },
        selection: {
            mode: null
        },
        series: {
            // downsample: {
            //   threshold: 0
            // },
            lines: {
                fill: false,
                show: true
            },
            points: {
                fill: true,
                radius: 2,
                show: false
            },
            //            points : {
            //                 show: true
            //            },
            shadowSize: 1
        },
        touch: {
            delayTouchEnded: 200,
            pan: 'x',
            scale: ''
        },
        xaxis: {
            mode: 'time',
            timezone: 'browser',
            // monthNames: monthNamesTranslaterServ.getMonthNames()
            //            timeformat: '%Y/%m/%d',
            // use these the following two lines to have small ticks at the bottom ob the diagram
            //            tickLength: 5,
            //            tickColor: '#000'
        },
        yaxis: {
            additionalWidth: 17,
            labelWidth: 50,
            min: null,
            panRange: false,
            show: true,
            // tickFormatter: function(val, axis) {
            //     var factor = axis.tickDecimals ? Math.pow(10, axis.tickDecimals) : 1;
            //     var formatted = '' + Math.round(val * factor) / factor;
            //     return formatted + '<br>' + this.uom;
            // }
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

        this.profileDatasetIds.forEach((entry) => {
            this.profileDatasetOptions.set(entry, [new TimedDatasetOptions(entry, '#00FF00', 1491178657000)]);
        });
    }
}
