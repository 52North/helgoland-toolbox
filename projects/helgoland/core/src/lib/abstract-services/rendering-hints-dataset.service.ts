import { Observable, Observer } from 'rxjs';

import { DatasetApiInterface } from '../dataset-api/api-interface';
import { BarRenderingHints, IDataset, LineRenderingHints } from '../model/dataset-api/dataset';
import { DatasetOptions } from '../model/internal/options';
import { DatasetService } from './dataset.service';

export abstract class RenderingHintsDatasetService<T extends DatasetOptions | DatasetOptions[]> extends DatasetService<T> {

    constructor(
        protected api: DatasetApiInterface
    ) {
        super();
    }

    public addDataset(internalId: string, options?: T): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            if (options) {
                this.datasetIds.push(internalId);
                this.datasetOptions.set(internalId, options);
                observer.next(true);
                observer.complete();
                this.datasetIdsChanged.emit(this.datasetIds);
            } else if (this.datasetIds.indexOf(internalId) < 0) {
                this.api.getSingleTimeseriesByInternalId(internalId).subscribe(
                    (timeseries) => this.addLoadedDataset(timeseries, observer),
                    (error) => {
                        this.api.getDatasetByInternalId(internalId).subscribe(
                            (dataset) => this.addLoadedDataset(dataset, observer)
                        );
                    }
                );
            }
        });
    }

    private addLoadedDataset(dataset: IDataset, observer: Observer<boolean>) {
        this.datasetIds.push(dataset.internalId);
        this.datasetOptions.set(dataset.internalId, this.createOptionsOfRenderingHints(dataset));
        observer.next(true);
        observer.complete();
        this.datasetIdsChanged.emit(this.datasetIds);
        this.saveState();
    }

    private createOptionsOfRenderingHints(dataset: IDataset): T {
        const options = this.createStyles(dataset.internalId) as DatasetOptions;
        if (dataset.renderingHints) {
            if (dataset.renderingHints.properties && dataset.renderingHints.properties.color) {
                options.color = dataset.renderingHints.properties.color;
            }
            switch (dataset.renderingHints.chartType) {
                case 'line':
                    this.handleLineRenderingHints(dataset.renderingHints as LineRenderingHints, options);
                    break;
                case 'bar':
                    this.handleBarRenderingHints(dataset.renderingHints as BarRenderingHints, options);
                    break;
                default:
                    break;
            }
        }
        return options as T;
    }


    private handleLineRenderingHints(lineHints: LineRenderingHints, options: DatasetOptions) {
        if (lineHints.properties.width) {
            options.lineWidth = Math.round(parseFloat(lineHints.properties.width));
        }
    }

    private handleBarRenderingHints(barHints: BarRenderingHints, options: DatasetOptions) {
        if (barHints.properties.width) {
            options.lineWidth = Math.round(parseFloat(barHints.properties.width));
        }
    }
}
