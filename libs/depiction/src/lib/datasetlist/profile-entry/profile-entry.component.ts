import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    DatasetType,
    HelgolandLocatedProfileData,
    HelgolandProfile,
    HelgolandServicesConnector,
    InternalIdHandler,
    TimedDatasetOptions,
    Timespan,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../list-entry.component';
import { DatasetFilter } from './../../../../../core/src/lib/api-communication/model/internal/dataset';

@Component({
    selector: 'n52-profile-entry',
    templateUrl: './profile-entry.component.html',
    styleUrls: ['./profile-entry.component.scss']
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

    @Output()
    public onOpenInCombiView: EventEmitter<TimedDatasetOptions> = new EventEmitter();

    @Output()
    public onShowGeometry: EventEmitter<GeoJSON.GeoJsonObject> = new EventEmitter();

    public dataset: HelgolandProfile;

    public editableOptions: TimedDatasetOptions;
    public tempColor: string;

    constructor(
        protected servicesConnector: HelgolandServicesConnector,
        protected internalIdHandler: InternalIdHandler,
        protected translateSrvc: TranslateService
    ) {
        super(internalIdHandler, translateSrvc);
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

    public openInCombiView(option: TimedDatasetOptions) {
        this.onOpenInCombiView.emit(option);
    }

    public showGeometry(option: TimedDatasetOptions) {
        const internalId = this.internalIdHandler.resolveInternalId(this.datasetId);
        if (this.dataset.isMobile) {
            const timespan = new Timespan(option.timestamp);
            this.servicesConnector.getDatasetData(this.dataset, timespan).subscribe(
                result => {
                    if (result.values.length === 1 && result instanceof HelgolandLocatedProfileData) {
                        this.onShowGeometry.emit(result.values[0].geometry);
                    }
                }
            );
        } else {
            this.servicesConnector.getPlatform(this.dataset.parameters.platform.id, internalId.url)
                .subscribe((station) => this.onShowGeometry.emit(station.geometry));
        }
    }

    protected loadDataset(locale?: string) {
        const params: DatasetFilter = {};
        if (locale) { params.locale = locale; }
        this.loading = true;
        this.servicesConnector.getDataset(this.internalId, { ...params, type: DatasetType.Profile }).subscribe(
            dataset => this.dataset = dataset,
            error => console.error(error),
            () => this.loading = false
        );
    }

}
