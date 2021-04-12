import { Component } from '@angular/core';
import { DatasetType, FilteredProvider, HelgolandDataset, HelgolandParameterFilter } from '@helgoland/core';
import { ListSelectorParameter, MultiServiceFilterEndpoint } from '@helgoland/selector';

@Component({
    templateUrl: './list-selection.component.html',
    styleUrls: ['./list-selection.component.scss']
})
export class ListSelectionComponent {

    public categoryParams: ListSelectorParameter[] = [{
        type: MultiServiceFilterEndpoint.platform,
        header: 'Platform'
    }, {
        type: MultiServiceFilterEndpoint.feature,
        header: 'Station'
    }, {
        type: MultiServiceFilterEndpoint.phenomenon,
        header: 'Phänomen'
    }, {
        type: MultiServiceFilterEndpoint.procedure,
        header: 'Sensor'
    }];

    public selectedProviderList: FilteredProvider[] = [];

    public parameterFilter: HelgolandParameterFilter = { type: DatasetType.Timeseries }

    constructor() {
        this.selectedProviderList.push({
            id: '1',
            url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/',
            filter: {}
        });
    }

    public onDatasetSelected(datasets: HelgolandDataset[]) {
        datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));
    }

}
