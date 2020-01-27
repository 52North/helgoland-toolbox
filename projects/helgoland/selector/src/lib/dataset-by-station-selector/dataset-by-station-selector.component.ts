import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    DatasetType,
    HelgolandDataset,
    HelgolandPlatform,
    HelgolandServicesHandlerService,
    HelgolandTimeseries,
} from '@helgoland/core';

export class SelectableDataset extends HelgolandTimeseries {
    public selected: boolean;
}

@Component({
    selector: 'n52-dataset-by-station-selector',
    templateUrl: './dataset-by-station-selector.component.html',
    styleUrls: ['./dataset-by-station-selector.component.scss']
})
export class DatasetByStationSelectorComponent implements OnInit {

    @Input()
    public station: HelgolandPlatform;

    @Input()
    public url: string;

    @Input()
    public defaultSelected = false;

    @Input()
    public phenomenonId: string;

    @Output()
    public onSelectionChanged: EventEmitter<HelgolandDataset[]> = new EventEmitter<HelgolandDataset[]>();

    public timeseriesList: SelectableDataset[] = [];

    public counter: number;

    constructor(
        protected servicesHandler: HelgolandServicesHandlerService
    ) { }

    public ngOnInit() {
        if (this.station) {
            this.servicesHandler.getPlatform(this.station.id, this.url)
                .subscribe((station) => {
                    this.station = station;
                    this.counter = 0;
                    this.station.datasetIds.forEach(id => {
                        this.counter++;
                        this.servicesHandler.getDataset({ id: id, url: this.url }, { type: DatasetType.Timeseries })
                            .subscribe((result) => {
                                this.prepareResult(result as SelectableDataset, this.defaultSelected);
                                this.counter--;
                            }, (error) => {
                                this.counter--;
                            });
                    });
                });
        }
    }

    public toggle(timeseries: SelectableDataset) {
        timeseries.selected = !timeseries.selected;
        this.updateSelection();
    }

    protected prepareResult(result: SelectableDataset, selection: boolean) {
        result.selected = selection;
        this.timeseriesList.push(result);
        this.updateSelection();
    }

    private updateSelection() {
        const selection = this.timeseriesList.filter((entry) => entry.selected);
        this.onSelectionChanged.emit(selection);
    }

}
