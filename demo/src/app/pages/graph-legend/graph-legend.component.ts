import { Component } from '@angular/core';

import { PlotOptions } from '../../../../../src/components/graph/flot/model';
import { DatasetOptions } from './../../../../../src/model/internal/options';
import { Timespan } from './../../../../../src/model/internal/timeInterval';
import { ColorService } from './../../../../../src/services/color/color.service';

@Component({
    selector: 'my-app',
    templateUrl: './graph-legend.component.html',
    styleUrls: ['./graph-legend.component.css']
})
export class GraphLegendComponent {

    public datasetIds = [
        'http://www.fluggs.de/sos2/api/v1/__26',
        'http://www.fluggs.de/sos2/api/v1/__51',
        'http://nexos.demo.52north.org:80/52n-sos-nexos-test/api/__quantity_106'
    ];
    public timespan;
    public diagramOptions: PlotOptions = {
        crosshair: {
            mode: 'x'
        },
        showReferenceValues: true,
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

    public overviewOptions: PlotOptions = {
        series: {
            // downsample: {
            //   threshold: 0
            // },
            points: {
                show: false,
                radius: 1
            },
            lines: {
                show: true,
                fill: false
            },
            shadowSize: 1
        },
        selection: {
            mode: 'overview',
            color: '#718296',
            shape: 'butt',
            minSize: 30
        },
        grid: {
            hoverable: false,
            autoHighlight: false
        },
        xaxis: {
            mode: 'time',
            timezone: 'browser',
            // monthNames: monthNamesTranslaterServ.getMonthNames()
        },
        yaxis: {
            show: false
        },
        legend: {
            show: false
        },
        touch: {
            pan: '',
            scale: ''
        }
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();

    public highlightId: string;

    constructor(
        private color: ColorService
    ) {
        this.datasetIds.forEach((entry) => {
            const option = new DatasetOptions(entry, this.color.getColor());
            option.generalize = true;
            this.datasetOptions.set(entry, option);
        });

        const end = 1491200000000;
        const diff = 4000000000;
        this.timespan = new Timespan(end - diff, end);
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    public isSelected(id: string) {
        return false;
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        console.log('show geometry: ' + JSON.stringify(geometry));
    }

    public highlight(id: string) {
        this.highlightId = id;
    }
}
