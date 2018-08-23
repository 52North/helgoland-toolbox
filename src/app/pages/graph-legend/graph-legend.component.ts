import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColorService, DatasetOptions, Time, Timespan } from '@helgoland/core';
import { PlotOptions } from '@helgoland/flot';
import { D3PlotOptions } from 'projects/helgoland/d3/src/public_api';

import { GeometryViewComponent } from '../../components/geometry-view/geometry-view.component';
import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
    templateUrl: './graph-legend.component.html',
    styleUrls: ['./graph-legend.component.css']
})
export class GraphLegendComponent {

    public datasetIds = [
        'http://www.fluggs.de/sos2/api/v1/__26',
        'http://www.fluggs.de/sos2/api/v1/__51',
        'http://www.fluggs.de/sos2/api/v1/__72',
        // 'http://nexos.demo.52north.org:80/52n-sos-nexos-test/api/__100',
        // 'http://mudak-wrm.dev.52north.org/sos/api/__70'
    ];
    public reloadForDatasets = [];
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

    public d3diagramOptions: D3PlotOptions = {
        yaxis: true,
        copyright: {
            label: 'This should be bottom right and the text is long.',
            positionX: 'left',
            positionY: 'bottom'
        }
    };

    public overviewOptions: PlotOptions = {
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
        },
        generalizeAllways: true
    };

    public d3overviewOptions: D3PlotOptions = {
        overview: true,
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();

    public highlightId: string;

    public selectedIds: string[] = [];

    public overviewLoading: boolean;
    public graphLoading: boolean;

    constructor(
        private color: ColorService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private time: Time
    ) {
        this.datasetIds.forEach((entry) => {
            const option = new DatasetOptions(entry, this.color.getColor());
            option.generalize = true;
            this.datasetOptions.set(entry, option);
        });

        const end = 1491200000000;
        const diff = 2000000000;
        this.timespan = new Timespan(end - diff, end);
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    public isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        this.dialog.open(GeometryViewComponent, {
            data: geometry
        });
    }

    public refreshData() {
        this.reloadForDatasets = [this.datasetIds[0]];
    }

    public highlight(selected: boolean, id: string) {
        this.highlightId = id;
    }

    public setSelected(selectedIds: string[]) {
        this.selectedIds = selectedIds;
    }

    public deleteTimeseries(id: string) {
        const idx = this.datasetIds.findIndex((entry) => entry === id);
        this.datasetIds.splice(idx, 1);
        this.datasetOptions.delete(id);
    }

    public changeYAxesVisibility() {
        this.diagramOptions.yaxis.show = !this.diagramOptions.yaxis.show;
        this.d3diagramOptions.yaxis = !this.d3diagramOptions.yaxis;
    }

    public updateOptions(option: DatasetOptions) {
        console.log('updateOptions' + JSON.stringify(option));
    }

    public onGraphLoading(loading: boolean) {
        this.graphLoading = loading;
    }

    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }

    public editOption(option: DatasetOptions) {
        this.dialog.open(StyleModificationComponent, {
            data: option
        });
    }

    public dateChanged(date: Date) {
        this.timespan = this.time.centerTimespan(this.timespan, date);
    }

    public selectTimeseries(selected: boolean, id: string) {
        if (selected) {
            if (this.selectedIds.indexOf(id) < 0) {
                this.selectedIds.push(id);
            }
        } else {
            if (this.selectedIds.indexOf(id) >= 0) {
                this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === id), 1);
            }
        }
    }

    public refresh(triggered) {
        console.log('refresh at ' + new Date());
    }

}
