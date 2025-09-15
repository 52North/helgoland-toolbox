import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TimedDatasetOptions } from '@helgoland/core';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
  templateUrl: './profile-entry.component.html',
  styleUrls: ['./profile-entry.component.scss'],
  imports: [HelgolandDatasetlistModule, MatDialogModule],
})
export class ProfileEntryComponent {
  private dialog = inject(MatDialog);

  id =
    'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_12';

  id2 =
    'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity-profile_73';

  datasetOptions: TimedDatasetOptions[] = [];

  datasetOptions2: TimedDatasetOptions[] = [];

  constructor() {
    this.datasetOptions.push(
      new TimedDatasetOptions(this.id, '#00FF00', 1491178657000),
    );
    this.datasetOptions.push(
      new TimedDatasetOptions(this.id, '#FF0000', 1507560238000),
    );

    this.datasetOptions2.push(
      new TimedDatasetOptions(this.id2, '#6363ba', 1495642266000),
    );
  }

  updateOptions(options: TimedDatasetOptions[]) {
    console.log('update options');
  }

  deleteProfileOptions(option: TimedDatasetOptions) {
    console.log('delete options');
  }

  selectProfile(selected: boolean, id: string) {
    console.log(id + ' selected: ' + selected);
  }

  editOption(option: TimedDatasetOptions) {
    const dialogRef = this.dialog.open(StyleModificationComponent, {
      data: option,
    });

    // dialogRef.afterClosed().subscribe((result) => { });
  }

  openCombiView(option: TimedDatasetOptions) {
    console.log('open in combi view');
  }

  showGeometry(geometry: GeoJSON.GeoJsonObject) {
    console.log('show geometry-type: ');
    console.dir(geometry);
  }
}
