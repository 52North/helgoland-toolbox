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
    ColorService,
    DatasetApiInterface,
    FirstLastValue,
    IDataset,
    IdCache,
    InternalIdHandler,
    ReferenceValue,
    Time,
    TimeInterval,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import {
    ConfigurableTimeseriesEntryComponent,
} from '../configurable-timeseries-entry/configurable-timeseries-entry.component';

@Injectable()
export class ReferenceValueColorCache extends IdCache<{ color: string, visible: boolean }> { }

@Component({
    selector: 'n52-timeseries-entry',
    templateUrl: './timeseries-entry.component.html',
    styleUrls: ['./timeseries-entry.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TimeseriesEntryComponent extends ConfigurableTimeseriesEntryComponent implements OnChanges {

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public changedSelectedDatasets: string;

    @Input()
    public highlight: boolean;

    @Output()
    public onSelectDate: EventEmitter<Date> = new EventEmitter();

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
        protected refValCache: ReferenceValueColorCache,
        protected translateSrvc: TranslateService
    ) {
        super(api, internalIdHandler, translateSrvc);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.changedSelectedDatasets) {
            if (changes.changedSelectedDatasets.firstChange !== true) {
                changes.changedSelectedDatasets.currentValue.forEach((obj) => {
                    this.toggleUomSelection(obj.id, obj.change);
                });
            }
        }

        if (changes.timeInterval) {
            this.checkDataInTimespan();
        }
    }

    public toggleUomSelection(id, selected) {
        if (this.datasetId === id) {
            this.selected = selected;
            this.onSelectDataset.emit(this.selected);
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

    protected setParameters() {
        super.setParameters();
        this.firstValue = this.dataset.firstValue;
        this.lastValue = this.dataset.lastValue;
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
