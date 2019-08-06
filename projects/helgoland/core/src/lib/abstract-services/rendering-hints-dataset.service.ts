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

    public async addDataset(internalId: string, options?: T): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (options) {
                this.datasetIds.push(internalId);
                this.datasetOptions.set(internalId, options);
                this.datasetIdsChanged.emit(this.datasetIds);
                resolve(true);
            } else if (this.datasetIds.indexOf(internalId) < 0) {
                this.api.getSingleTimeseriesByInternalId(internalId).subscribe(
                    (timeseries) => this.addLoadedDataset(timeseries, resolve),
                    (error) => {
                        this.api.getDatasetByInternalId(internalId).subscribe(
                            (dataset) => this.addLoadedDataset(dataset, resolve)
                        );
                    }
                );
            }
        });
    }

    private async addLoadedDataset(dataset: IDataset, resolve: (value?: boolean | PromiseLike<boolean>) => void) {
        this.datasetIds.push(dataset.internalId);
        this.datasetOptions.set(dataset.internalId, this.createOptionsOfRenderingHints(dataset));
        this.datasetIdsChanged.emit(this.datasetIds);
        this.saveState();
        resolve(true);
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
