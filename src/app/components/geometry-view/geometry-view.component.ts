import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
    templateUrl: './geometry-view.component.html',
    styleUrls: ['./geometry-view.component.scss']
})
export class GeometryViewComponent {

    public mapOptions: L.MapOptions = {
        maxZoom: 15
    };

    constructor(
        public dialogRef: MatDialogRef<GeometryViewComponent>,
        @Inject(MAT_DIALOG_DATA)
        public geometry: GeoJSON.GeoJsonObject
    ) { }

    public onOk() {
        this.dialogRef.close();
    }
}
