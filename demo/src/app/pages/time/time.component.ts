import { Component } from '@angular/core';

import { NotifierService } from '../../../../../src/services/notifier/notifier.service';

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
        private notifier: NotifierService
    ) { }

    public notify() {
        this.notifier.notify('test');
    }

}
