import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColorService, DatasetOptions, Timespan } from '@helgoland/core';
import { AdditionalData, D3PlotOptions } from '@helgoland/d3';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
    templateUrl: './additional-data-graph.component.html',
    styleUrls: ['./additional-data-graph.component.css']
})
export class AdditionalDataGraphComponent {

    public datasetIds = [
        'https://fluggs.wupperverband.de/sos2/api/v1/__26',
    ];

    public additionalData: AdditionalData[] = [];
    public timespan: Timespan;

    public graphOptions: D3PlotOptions = {
        yaxis: true
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();

    public selectedIds: string[] = [];

    public graphLoading: boolean;

    public interval: any;

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

        const options = new DatasetOptions('addData', 'red');
        options.pointRadius = 3;
        options.lineWidth = 3;
        this.additionalData = [{
            // linkedDatasetId: this.datasetIds[0],
            internalId: 'temp',
            yaxisLabel: 'random',
            datasetOptions: options,
            data: [
                {
                    timestamp: new Date().getTime(),
                    value: this.createValue()
                }
            ]
        }];
    }

    public toggleTimer() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        } else {
            this.interval = setInterval(() => {
                this.additionalData[0].data.push({
                    timestamp: new Date().getTime(),
                    value: this.createValue()
                });
                this.additionalData = Object.assign([], this.additionalData);
                this.setNewTimespan();
            }, 1000);
        }
    }

    private setNewTimespan() {
        const end = new Date().getTime();
        const diff = 60000;
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

    public removeEntry(idx: number) {
        this.additionalData[0].data.splice(idx, 1);
        this.timespan = new Timespan(this.timespan.from, this.timespan.to);
    }


    private createValue(): number {
        return Math.random() * 10;
    }

}


