import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TimedDatasetOptions } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss'],
    imports: [
        HelgolandDatasetlistModule,
        MatDialogModule
    ],
    standalone: true
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

    public updateOptions(options: TimedDatasetOptions[]) {
        console.log('update options');
    }

    public deleteProfileOptions(option: TimedDatasetOptions) {
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

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        console.log('show geometry-type: ');
        console.dir(geometry);
    }
}
