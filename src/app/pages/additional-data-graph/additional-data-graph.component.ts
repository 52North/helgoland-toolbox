import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ColorService, DatasetOptions, Timespan } from '@helgoland/core';
import { AddtionalData, D3PlotOptions } from '@helgoland/d3';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
    templateUrl: './additional-data-graph.component.html',
    styleUrls: ['./additional-data-graph.component.css']
})
export class AdditionalDataGraphComponent {

    public datasetIds = [
        'http://www.fluggs.de/sos2/api/v1/__26',
    ];

    public additionalData: AddtionalData[] = [];
    public timespan;

    public graphOptions: D3PlotOptions = {
        yaxis: true
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();

    public selectedIds: string[] = [];

    public graphLoading: boolean;

    constructor(
        private color: ColorService,
        private dialog: MatDialog
    ) {
        this.datasetIds.forEach((entry) => {
            const option = new DatasetOptions(entry, this.color.getColor());
            option.generalize = true;
            option.lineWidth = 3;
            option.pointRadius = 3;
            this.datasetOptions.set(entry, option);
        });

        this.setNewTimespan();

        const options = new DatasetOptions(this.datasetIds[0], 'red');
        options.pointRadius = 3;
        options.lineWidth = 3;
        this.additionalData = [{
            // linkedDatasetId: this.datasetIds[0],
            yaxisLabel: 'random',
            datasetOptions: options,
            data: [
                {
                    timestamp: new Date().getTime() - 1000,
                    value: Math.random()
                },
                {
                    timestamp: new Date().getTime(),
                    value: Math.random()
                }
            ]
        }];

        setInterval(() => {
            this.additionalData[0].data.push({
                timestamp: new Date().getTime(),
                value: Math.random()
            });
            this.additionalData = Object.assign([], this.additionalData);
            this.setNewTimespan();
        }, 1000);
    }

    private setNewTimespan() {
        const end = new Date().getTime();
        const diff = 20000;
        this.timespan = new Timespan(end - diff, end);
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    public setSelected(selectedIds: string[]) {
        this.selectedIds = selectedIds;
    }

    public deleteTimeseries(id: string) {
        const idx = this.datasetIds.findIndex((entry) => entry === id);
        this.datasetIds.splice(idx, 1);
        this.datasetOptions.delete(id);
    }

    public onGraphLoading(loading: boolean) {
        this.graphLoading = loading;
    }

    public editOption(option: DatasetOptions) {
        this.dialog.open(StyleModificationComponent, {
            data: option
        });
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

}
