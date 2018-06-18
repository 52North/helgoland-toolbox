import { Component } from '@angular/core';
import { DatasetOptions, Timespan } from '@helgoland/core';

@Component({
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent {

    public datasetIds = [
        'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__95',
        'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__96',
        'http://geo.irceline.be/sos/api/v1/__6941',
        'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__97'
    ];

    public selectedDatasetIds = [];

    public timespan = new Timespan(
        new Date('2017-10-24T01:49:59.000Z').getTime(),
        new Date('2017-10-25T01:49:59.000Z').getTime()
    );

    public datasetOptions: Map<string, DatasetOptions> = new Map();

    constructor() {
        let i = 0;
        const colors = ['firebrick', 'yellow', 'darkgreen', 'lightblue'];
        this.datasetIds.forEach((entry) => {
            this.datasetOptions.set(entry, new DatasetOptions(entry, colors[i++]));
            if (i % 2 === 0) {
                this.selectedDatasetIds.push(entry);
            }
        });
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }
}
