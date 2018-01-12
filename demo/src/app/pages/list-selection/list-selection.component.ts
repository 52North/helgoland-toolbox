import { Component } from '@angular/core';
import { selector } from 'rxjs/operator/publish';
import { ListSelectorParameter, Provider } from '../../../../../src/index';

@Component({
    selector: 'list-selection',
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

    constructor(
    ) {
        this.selectedProviderList.push({
            id: '1',
            url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/'
        });
    }

}
