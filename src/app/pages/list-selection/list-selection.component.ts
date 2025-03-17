import { Component } from '@angular/core';
import {
  DatasetType,
  FilteredProvider,
  HelgolandDataset,
  HelgolandParameterFilter,
} from '@helgoland/core';
import {
  HelgolandSelectorModule,
  ListSelectorParameter,
  MultiServiceFilterEndpoint,
} from '@helgoland/selector';

@Component({
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.scss'],
  imports: [HelgolandSelectorModule],
  standalone: true,
})
export class ListSelectionComponent {
  public categoryParams: ListSelectorParameter[] = [
    {
      type: 'platform',
      header: 'Platform',
      filterList: [],
    },
    {
      type: 'feature',
      header: 'Station',
      filterList: [],
    },
    {
      type: 'phenomenon',
      header: 'Phänomen',
      filterList: [],
    },
    {
      type: 'procedure',
      header: 'Sensor',
      filterList: [],
    },
  ];

  public selectedProviderList: FilteredProvider[] = [];

  public parameterFilter: HelgolandParameterFilter = {
    type: DatasetType.Timeseries,
  };

  constructor() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/',
      filter: {},
    });
  }

  public onDatasetSelected(datasets: HelgolandDataset[]) {
    datasets.forEach((dataset) =>
      console.log(
        'Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id,
      ),
    );
  }
}
