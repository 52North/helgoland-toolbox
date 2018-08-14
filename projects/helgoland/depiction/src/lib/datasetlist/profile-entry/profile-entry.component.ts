import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    Dataset,
    DatasetApiInterface,
    InternalIdHandler,
    LocatedProfileDataEntry,
    ParameterFilter,
    PlatformTypes,
    TimedDatasetOptions,
    Timespan,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { ListEntryComponent } from '../list-entry.component';

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

    public dataset: Dataset;

    public editableOptions: TimedDatasetOptions;
    public tempColor: string;

    constructor(
        protected api: DatasetApiInterface,
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

    public isMobile() {
        if (this.dataset) {
            return this.dataset.platformType === PlatformTypes.mobileInsitu;
        }
        return false;
    }

    public openInCombiView(option: TimedDatasetOptions) {
        this.onOpenInCombiView.emit(option);
    }

    public showGeometry(option: TimedDatasetOptions) {
        const internalId = this.internalIdHandler.resolveInternalId(this.datasetId);
        if (this.isMobile()) {
            const timespan = new Timespan(option.timestamp);
            this.api.getData<LocatedProfileDataEntry>(internalId.id, internalId.url, timespan).subscribe((result) => {
                if (result.values.length === 1) {
                    this.onShowGeometry.emit(result.values[0].geometry);
                }
            });
        } else {
            this.api.getPlatform(this.dataset.parameters.platform.id, internalId.url).subscribe((platform) => {
                this.onShowGeometry.emit(platform.geometry);
            });
        }
    }

    protected loadDataset(lang?: string) {
        const params: ParameterFilter = {};
        if (lang) { params.lang = lang; }
        this.loading = true;
        this.api.getDataset(this.internalId.id, this.internalId.url, params).subscribe((dataset) => {
            this.dataset = dataset;
            this.loading = false;
        });
    }

}
