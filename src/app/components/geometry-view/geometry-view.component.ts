import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HelgolandMapViewModule } from '@helgoland/map';

@Component({
  templateUrl: './geometry-view.component.html',
  styleUrls: ['./geometry-view.component.scss'],
  imports: [HelgolandMapViewModule],
})
export class GeometryViewComponent {
  dialogRef = inject<MatDialogRef<GeometryViewComponent>>(MatDialogRef);
  geometry = inject<GeoJSON.GeoJsonObject>(MAT_DIALOG_DATA);

  mapOptions: L.MapOptions = {
    maxZoom: 15,
  };

  onOk() {
    this.dialogRef.close();
  }
}
