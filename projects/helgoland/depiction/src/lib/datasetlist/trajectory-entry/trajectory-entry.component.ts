import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dataset, DatasetApiInterface, DatasetOptions, InternalIdHandler, ParameterFilter } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../list-entry.component';

@Component({
    selector: 'n52-trajectory-entry',
    templateUrl: './trajectory-entry.component.html'
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
        protected api: DatasetApiInterface,
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

    protected loadDataset(lang?: string): void {
        const params: ParameterFilter = {};
        if (lang) { params.lang = lang; }
        this.api.getDataset(this.internalId.id, this.internalId.url, params).subscribe((dataset) => this.dataset = dataset);
    }

}
