import { StyleModificationComponent } from './style-modification/style-modification.component';
import { TimedDatasetOptions } from '../../../../lib';
import { Component, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'my-app',
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss']
})
export class ProfileEntryComponent {

    public id = 'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12';

    public datasetOptions: TimedDatasetOptions[] = [];

    constructor(
        private dialog: MatDialog
    ) {
        this.datasetOptions.push(new TimedDatasetOptions(this.id, '#00FF00', 1491178657000));
        this.datasetOptions.push(new TimedDatasetOptions(this.id, '#FF0000', 1507560238000));
        this.datasetOptions.push(new TimedDatasetOptions(this.id, '#6363ba', 1507560238001));
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
}
