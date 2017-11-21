import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';

import { TimeInterval } from '../../../model/internal/timeInterval';
import { ColorService } from '../../../services/color/color.service';
import { ListEntryComponent } from '../list-entry.component';
import { Dataset, FirstLastValue, IDataset, ReferenceValue, Timeseries } from './../../../model/api/dataset';
import { DatasetOptions } from './../../../model/internal/options';
import { ApiInterface } from './../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';

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
        private api: ApiInterface,
        private timeSrvc: Time,
        protected internalIdHandler: InternalIdHandler,
        private color: ColorService
    ) {
        super(internalIdHandler);
    }

    public ngOnChanges(changes: SimpleChanges) {
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
        if (idx > -1) {
            refValue.visible = false;
            this.datasetOptions.showReferenceValues.splice(idx, 1);
        } else {
            refValue.visible = true;
            this.datasetOptions.showReferenceValues.push({ id: refValue.referenceValueId, color: refValue.color });
        }
    }

    public editDatasetOptions(options: DatasetOptions) {
        this.onEditOptions.emit(options);
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
                e.visible = false;
                e.color = this.color.getColor();
            });
        }
        this.checkDataInTimespan();
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
