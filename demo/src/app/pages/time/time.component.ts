import { Component } from '@angular/core';

import { Timespan } from '../../../../../src/index';
import { ApiInterface } from '../../../../../src/services/api-interface/index';

@Component({
    selector: 'time',
    templateUrl: './time.component.html',
    styleUrls: ['./time.component.css']
})
export class TimeComponent {

    public timelist = [
        1500000000000,
        1600000000000,
        1700000000000,
        1800000000000,
        1900000000000,
        2000000000000,
        2100000000000,
        2200000000000,
        2300000000000,
        2400000000000,
        2500000000000
    ];

    constructor(
        private api: ApiInterface
    ) {
        const timespan = new Timespan(1463600000000, 1495800000000);
        this.api.getTsData<[number, number]>('26', 'http://www.fluggs.de/sos2/api/v1/', timespan, {
            format: 'flot',
            expanded: true,
            generalize: true
        }).subscribe((res) => console.log(res));
        this.api.getTsData<[number, number]>('26', 'http://www.fluggs.de/sos2/api/v1/', timespan, {
            format: 'flot',
            expanded: true,
            generalize: true
        }).subscribe((res) => console.log(res));
        this.api.getTsData<[number, number]>('26', 'http://www.fluggs.de/sos2/api/v1/', timespan, {
            format: 'flot',
            expanded: true,
            generalize: true
        }).subscribe((res) => console.log(res));
    }

}
