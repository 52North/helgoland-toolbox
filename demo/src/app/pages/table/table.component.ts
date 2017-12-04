import { Component } from '@angular/core';
import { Timespan } from './../../../../../src/model/internal/timeInterval';

@Component({
    selector: 'my-app',
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
    public timespan = new Timespan(
        new Date('2017-10-24T01:49:59.000Z').getTime(),
        new Date('2017-10-25T01:49:59.000Z').getTime()
    );

    constructor() {
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }
}
