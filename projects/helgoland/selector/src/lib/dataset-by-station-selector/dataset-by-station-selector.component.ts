import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HelgolandServicesHandlerService, Station, HelgolandDataset } from '@helgoland/core';

export class SelectableDataset extends HelgolandDataset {
    public selected: boolean;
}

@Component({
    selector: 'n52-dataset-by-station-selector',
    templateUrl: './dataset-by-station-selector.component.html',
    styleUrls: ['./dataset-by-station-selector.component.scss']
})
export class DatasetByStationSelectorComponent implements OnInit {

    @Input()
    public station: Station;

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
            const stationId = this.station.properties && this.station.properties.id ? this.station.properties.id : this.station.id;
            this.servicesHandler.getStation(stationId, this.url)
                .subscribe((station) => {
                    this.station = station;
                    this.counter = 0;
                    for (const id in this.station.properties.timeseries) {
                        if (this.station.properties.timeseries.hasOwnProperty(id)) {
                            this.counter++;
                            this.servicesHandler.getDataset({ id: id, url: this.url })
                                .subscribe((result) => {
                                    this.prepareResult(result as SelectableDataset, this.defaultSelected);
                                    this.counter--;
                                }, (error) => {
                                    this.counter--;
                                });
                        }
                    }
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
