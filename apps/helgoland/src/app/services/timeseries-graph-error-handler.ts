import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HelgolandTimeseries } from '@helgoland/core';
import { D3TimeseriesGraphErrorHandler } from '@helgoland/d3';

@Injectable()
export class CustomD3TimeseriesGraphErrorHandler extends D3TimeseriesGraphErrorHandler {

    private readonly snackBarConfig: MatSnackBarConfig = {
        duration: 2000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center'
    };

    constructor(
        private snackBar: MatSnackBar
    ) {
        super();
    }

    public handleDataLoadError(error: any, dataset: HelgolandTimeseries): void {
        console.error(error);
        this.snackBar.open(`Error occured while load data for dataset '${dataset.label}'`, null, this.snackBarConfig);
    }

    public handleDatasetLoadError(error: any): void {
        console.error(error);
        this.snackBar.open(`Error occured while load dataset`, null, this.snackBarConfig);
    }

}
