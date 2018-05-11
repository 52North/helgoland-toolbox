import {
    Component,
    EventEmitter,
    Injectable,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewEncapsulation,
} from '@angular/core';
import {
    DatasetApiInterface,
    ColorService,
    Dataset,
    DatasetOptions,
    FirstLastValue,
    IDataset,
    IdCache,
    InternalIdHandler,
    ReferenceValue,
    Time,
    TimeInterval,
    Timeseries,
} from '@helgoland/core';

import { ListEntryComponent } from '../list-entry.component';

@Injectable()
export class ReferenceValueColorCache extends IdCache<{ color: string, visible: boolean }> { }

@Component({
    selector: 'n52-timeseries-entry',
    templateUrl: './timeseries-entry.component.html',
    styleUrls: ['./timeseries-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimeseriesEntryComponent extends ListEntryComponent implements OnChanges {

    @Input()
    public datasetOptions: DatasetOptions;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public onSelectDatasetId: string;

    @Output()
    public onUpdateOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    public onEditOptions: EventEmitter<DatasetOptions> = new EventEmitter();

    @Output()
    public onSelectDate: EventEmitter<Date> = new EventEmitter();

    @Output()
    public onShowGeometry: EventEmitter<GeoJSON.GeoJsonObject> = new EventEmitter();

    public platformLabel: string;
    public phenomenonLabel: string;
    public procedureLabel: string;
    public categoryLabel: string;
    public uom: string;
    public firstValue: FirstLastValue;
    public lastValue: FirstLastValue;
    public informationVisible = false;
    public tempColor: string;
    public hasData = true;
    public referenceValues: ReferenceValue[];

    public dataset: IDataset;

    constructor(
        protected api: DatasetApiInterface,
        protected timeSrvc: Time,
        protected internalIdHandler: InternalIdHandler,
        protected color: ColorService,
        protected refValCache: ReferenceValueColorCache
    ) {
        super(internalIdHandler);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.onSelectDatasetId && (changes.onSelectDatasetId.firstChange !== true)) {
            this.toggleSelection();
        }

        if (changes.timeInterval) {
            this.checkDataInTimespan();
        }
    }

    public toggleInformation() {
        this.informationVisible = !this.informationVisible;
    }

    public jumpToFirstTimeStamp() {
        this.onSelectDate.emit(new Date(this.dataset.firstValue.timestamp));
    }

    public jumpToLastTimeStamp() {
        this.onSelectDate.emit(new Date(this.dataset.lastValue.timestamp));
    }

    public toggleVisibility() {
        this.datasetOptions.visible = !this.datasetOptions.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public toggleReferenceValue(refValue: ReferenceValue) {
        const idx = this.datasetOptions.showReferenceValues.findIndex((entry) => entry.id === refValue.referenceValueId);
        const refValId = this.createRefValId(refValue.referenceValueId);
        if (idx > -1) {
            refValue.visible = false;
            this.datasetOptions.showReferenceValues.splice(idx, 1);
        } else {
            refValue.visible = true;
            this.datasetOptions.showReferenceValues.push({ id: refValue.referenceValueId, color: refValue.color });
        }
        this.refValCache.get(refValId).visible = refValue.visible;
        this.onUpdateOptions.emit(this.datasetOptions);
    }

    public editDatasetOptions() {
        this.onEditOptions.emit(this.datasetOptions);
    }

    public showGeometry() {
        if (this.dataset instanceof Timeseries) {
            this.onShowGeometry.emit(this.dataset.station.geometry);
        }
        if (this.dataset instanceof Dataset) {
            this.api.getPlatform(this.dataset.parameters.platform.id, this.dataset.url).subscribe((platform) => {
                this.onShowGeometry.emit(platform.geometry);
            });
        }
    }

    protected loadDataset(id: string, url: string) {
        this.api.getSingleTimeseries(id, url).subscribe((timeseries) => {
            this.dataset = timeseries;
            this.setParameters();
        }, (error) => {
            this.api.getDataset(id, url).subscribe((dataset) => {
                this.dataset = dataset;
                this.setParameters();
            });
        });
    }

    private setParameters() {
        if (this.dataset instanceof Dataset) {
            this.platformLabel = this.dataset.parameters.platform.label;
        } else if (this.dataset instanceof Timeseries) {
            this.platformLabel = this.dataset.station.properties.label;
        }
        this.phenomenonLabel = this.dataset.parameters.phenomenon.label;
        this.procedureLabel = this.dataset.parameters.procedure.label;
        this.categoryLabel = this.dataset.parameters.category.label;
        this.firstValue = this.dataset.firstValue;
        this.lastValue = this.dataset.lastValue;
        this.uom = this.dataset.uom;
        if (this.dataset.referenceValues) {
            this.dataset.referenceValues.forEach((e) => {
                const refValId = this.createRefValId(e.referenceValueId);
                const refValOption = this.datasetOptions.showReferenceValues.find((o) => o.id === e.referenceValueId);
                if (refValOption) {
                    this.refValCache.set(refValId, {
                        color: refValOption.color,
                        visible: true
                    });
                }
                if (!this.refValCache.has(refValId)) {
                    this.refValCache.set(refValId, {
                        color: this.color.getColor(),
                        visible: false
                    });
                }
                e.color = this.refValCache.get(refValId).color;
                e.visible = this.refValCache.get(refValId).visible;
            });
        }
        this.checkDataInTimespan();
    }

    private createRefValId(refId: string) {
        return this.dataset.url + refId;
    }

    private checkDataInTimespan() {
        if (this.timeInterval && this.dataset) {
            this.hasData = this.timeSrvc.overlaps(
                this.timeInterval,
                this.dataset.firstValue.timestamp,
                this.dataset.lastValue.timestamp
            );
        }
    }
}
