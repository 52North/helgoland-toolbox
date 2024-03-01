import { Component } from '@angular/core';
import { DatasetOptions, Timespan } from '@helgoland/core';
import { D3PlotOptions, HelgolandD3Module } from '@helgoland/d3';
import { HelgolandModificationModule } from '@helgoland/modification';

@Component({
    templateUrl: './timeseries-graph.component.html',
    styleUrls: ['./timeseries-graph.component.css'],
    imports: [
        HelgolandD3Module,
        HelgolandModificationModule
    ],
    standalone: true
})
export class TimeseriesGraphComponent {

    public datasetIds = ['https://fluggs.wupperverband.de/sws5/api/__63'];
    public datasetIdsOne = ['https://fluggs.wupperverband.de/sws5/api/__72'];
    // public datasetIdsMultiple = ['https://fluggs.wupperverband.de/sws5/api/__26'];
    public datasetIdsMultiple = ['https://fluggs.wupperverband.de/sws5/api/__63', 'https://fluggs.wupperverband.de/sws5/api/__72', 'https://fluggs.wupperverband.de/sws5/api/__26'];
    public colors = ['#123456', '#FF0000'];

    public timespan = new Timespan(new Date().getTime() - 100000000, new Date().getTime());
    public diagramOptionsD3: D3PlotOptions = {
        togglePanZoom: false,
        showReferenceValues: false,
        hoverable: true,
        grid: true,
        // overview: false,
        generalizeAllways: true
    };

    public selectedIds: string[] = [];

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();
    public datasetOptionsMultiple: Map<string, DatasetOptions> = new Map();
    public datasetOptionsMultiple02: Map<string, DatasetOptions> = new Map();
    public panZoom = 'zoom';

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
        this.panZoom = this.diagramOptionsD3.togglePanZoom === true ? 'pan' : 'zoom';
    }

    public highlight(ids: string[]) {
        this.selectedIds = ids;
    }
}
