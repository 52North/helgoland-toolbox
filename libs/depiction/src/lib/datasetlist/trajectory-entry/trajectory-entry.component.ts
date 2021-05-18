import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    DatasetFilter,
    DatasetOptions,
    DatasetType,
    HelgolandServicesConnector,
    HelgolandTrajectory,
    InternalIdHandler,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../list-entry.component';

@Component({
    selector: 'n52-trajectory-entry',
    templateUrl: './trajectory-entry.component.html'
})
export class TrajectoryEntryComponent extends ListEntryComponent {

    @Input()
    public datasetOptions: DatasetOptions;

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    // eslint-disable-next-line @angular-eslint/no-output-on-prefix
    @Output()
    public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    public dataset: HelgolandTrajectory;

    public tempColor: string;

    constructor(
        protected servicesConnector: HelgolandServicesConnector,
        protected internalIdHandler: InternalIdHandler,
        protected translateSrvc: TranslateService
    ) {
        super(internalIdHandler, translateSrvc);
    }

    public toggleVisibility() {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public editDatasetOptions(options: DatasetOptions) {
        this.onEditOptions.emit(options);
    }

    protected loadDataset(locale?: string): void {
        const params: DatasetFilter = {};
        if (locale) { params.locale = locale; }
        this.loading = true;
        this.servicesConnector.getDataset(this.internalId, { ...params, type: DatasetType.Trajectory })
            .subscribe(
                trajectory => this.setTrajectory(trajectory),
                error => this.handleTrajectoryLoadError(error),
            );
    }

    protected handleTrajectoryLoadError(error: any): void {
        console.error(error);
        this.loading = false;
    }

    protected setTrajectory(trajectory: HelgolandTrajectory) {
        this.dataset = trajectory;
        this.loading = false;
    }
}
