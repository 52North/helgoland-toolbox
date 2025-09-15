import { Injectable } from '@angular/core';
import { HelgolandTimeseries } from '@helgoland/core';

export abstract class D3SeriesGraphErrorHandler {
  abstract handleDataLoadError(error: any, dataset: HelgolandTimeseries): void;

  abstract handleDatasetLoadError(error: any): void;
}

@Injectable()
export class D3SeriesSimpleGraphErrorHandler extends D3SeriesGraphErrorHandler {
  handleDataLoadError(error: any, dataset: HelgolandTimeseries) {
    console.error(error);
  }

  handleDatasetLoadError(error: any) {
    console.error(error);
  }
}
