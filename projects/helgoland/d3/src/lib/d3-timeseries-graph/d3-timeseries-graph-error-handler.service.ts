import { Injectable } from '@angular/core';
import { HelgolandTimeseries } from '@helgoland/core';

export abstract class D3TimeseriesGraphErrorHandler {
    public abstract handleDataLoadError(error: any, dataset: HelgolandTimeseries): void;

    public abstract handleDatasetLoadError(error: any): void
}

@Injectable()
export class D3TimeseriesSimpleGraphErrorHandler extends D3TimeseriesGraphErrorHandler {

    public handleDataLoadError(error: any, dataset: HelgolandTimeseries) {
        console.error(error);
    }

    public handleDatasetLoadError(error: any) {
        console.error(error);
    }

}