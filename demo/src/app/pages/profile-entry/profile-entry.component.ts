import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { TimedDatasetOptions } from './../../../../../src/model/internal/options';
import { StyleModificationComponent } from './style-modification/style-modification.component';

@Component({
    selector: 'my-app',
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss']
})
export class ProfileEntryComponent {

    public id = 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12';

    public id2 = 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_73';

    public datasetOptions: TimedDatasetOptions[] = [];

    public datasetOptions2: TimedDatasetOptions[] = [];

    constructor(
        private dialog: MatDialog
    ) {
        this.datasetOptions.push(new TimedDatasetOptions(this.id, '#00FF00', 1491178657000));
        this.datasetOptions.push(new TimedDatasetOptions(this.id, '#FF0000', 1507560238000));

        this.datasetOptions2.push(new TimedDatasetOptions(this.id2, '#6363ba', 1495642266000));
    }

    public updateOptions() {
        console.log('update options');
    }

    public deleteProfileOptions() {
        console.log('delete options');
    }

    public selectProfile(selected: boolean, id: string) {
        console.log(id + ' selected: ' + selected);
    }

    public editOption(option: TimedDatasetOptions) {
        const dialogRef = this.dialog.open(StyleModificationComponent, {
            data: option
        });

        // dialogRef.afterClosed().subscribe((result) => { });
    }

    public openCombiView(option: TimedDatasetOptions) {
        console.log('open in combi view');
    }

    public showGeometry(geometry: GeoJSON.GeometryObject) {
        console.log('show geometry-type: ');
        console.dir(geometry);
    }
}
