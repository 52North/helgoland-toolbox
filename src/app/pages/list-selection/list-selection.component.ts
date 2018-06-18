import { Component } from '@angular/core';
import { IDataset, Provider } from '@helgoland/core';
import { ListSelectorParameter } from '@helgoland/selector';

@Component({
    templateUrl: './list-selection.component.html',
    styleUrls: ['./list-selection.component.scss']
})
export class ListSelectionComponent {

    public categoryParams: ListSelectorParameter[] = [{
        type: 'category',
        header: 'Kategorie'
    }, {
        type: 'feature',
        header: 'Station'
    }, {
        type: 'phenomenon',
        header: 'Phänomen'
    }, {
        type: 'procedure',
        header: 'Sensor'
    }];

    public selectedProviderList: Provider[] = [];

    constructor() {
        this.selectedProviderList.push({
            id: '1',
            url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
        });
    }

    public onDatasetSelected(datasets: IDataset[]) {
        datasets.forEach((dataset) => console.log('Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id));
    }

}
