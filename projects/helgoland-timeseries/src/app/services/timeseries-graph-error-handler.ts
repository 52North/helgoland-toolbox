import { Injectable } from '@angular/core';
import { HelgolandTimeseries, NotifierService } from '@helgoland/core';
import { D3TimeseriesGraphErrorHandler } from '@helgoland/d3';

@Injectable()
export class CustomD3TimeseriesGraphErrorHandler extends D3TimeseriesGraphErrorHandler {

    constructor(
        private notifier: NotifierService
    ) {
        super();
    }

    public handleDataLoadError(error: any, dataset: HelgolandTimeseries): void {
        console.error(error);
        this.notifier.notify(`Error occured while load data for dataset '${dataset.label}'`);
    }

    public handleDatasetLoadError(error: any): void {
        console.error(error);
        this.notifier.notify(`Error occured while load dataset`);
    }

}
