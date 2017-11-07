import { Component } from '@angular/core';

import { TimedDatasetOptions } from './../../../../../src/model/internal/options';

@Component({
    selector: 'my-app',
    templateUrl: './plotly-graph.component.html',
    styleUrls: ['./plotly-graph.component.css']
})
export class PlotlyGraphComponent {

    public profileDatasetIds = ['http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12'];
    public profileDatasetOptions: Map<string, TimedDatasetOptions[]> = new Map();

    constructor() {
        this.profileDatasetIds.forEach((entry) => {
            this.profileDatasetOptions.set(entry, [new TimedDatasetOptions(entry, '#00FF00', 1491178657000)]);
        });
    }
}
