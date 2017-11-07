import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

import { ListEntryComponent } from '../list-entry.component';
import { Dataset } from './../../../model/api/dataset';
import { TimedDatasetOptions } from './../../../model/internal/options';
import { ApiInterface } from './../../../services/api-interface/api-interface.service';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';

@Component({
    selector: 'n52-profile-entry',
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileEntryComponent extends ListEntryComponent {

    @Input()
    public datasetOptions: TimedDatasetOptions[];

    @Output()
    public onUpdateOptions: EventEmitter<TimedDatasetOptions[]> = new EventEmitter();

    @Output()
    public onDeleteDatasetOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    public onEditOptions: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    public dataset: Dataset;

    public editableOptions: TimedDatasetOptions;
    public tempColor: string;

    constructor(
        private api: ApiInterface,
        protected internalIdHandler: InternalIdHandler
    ) {
        super(internalIdHandler);
    }

    public removeDatasetOptions(options: TimedDatasetOptions) {
        this.onDeleteDatasetOptions.emit(options);
    }

    public editDatasetOptions(options: TimedDatasetOptions) {
        this.onEditOptions.emit(options);
    }

    public toggleVisibility(options: TimedDatasetOptions) {
        options.visible = !options.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    protected loadDataset(id: string, url: string) {
        this.api.getDataset(id, url).subscribe((dataset) => {
            this.dataset = dataset;
        });
    }

}
