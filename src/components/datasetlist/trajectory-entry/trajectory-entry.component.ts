import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ListEntryComponent } from '../list-entry.component';
import { Dataset } from './../../../model/api/dataset';
import { DatasetOptions } from './../../../model/internal/options';
import { ApiInterface } from './../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';

@Component({
    selector: 'n52-trajectory-entry',
    templateUrl: './trajectory-entry.component.html',
    styleUrls: ['./trajectory-entry.component.scss']
})
export class TrajectoryEntryComponent extends ListEntryComponent {

    @Input()
    public datasetOptions: DatasetOptions;

    @Output()
    public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    public dataset: Dataset;

    public tempColor: string;

    constructor(
        private api: ApiInterface,
        protected internalIdHandler: InternalIdHandler
    ) {
        super(internalIdHandler);
    }

    public toggleVisibility() {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public editDatasetOptions(options: DatasetOptions) {
        this.onEditOptions.emit(options);
    }

    protected loadDataset(id: string, url: string): void {
        this.api.getDataset(id, url).subscribe((dataset) => this.dataset = dataset);
    }

}
