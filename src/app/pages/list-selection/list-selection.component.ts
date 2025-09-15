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
} from '@helgoland/selector';

@Component({
  templateUrl: './list-selection.component.html',
  styleUrls: ['./list-selection.component.scss'],
  imports: [HelgolandSelectorModule],
})
export class ListSelectionComponent {
  categoryParams: ListSelectorParameter[] = [
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

  selectedProviderList: FilteredProvider[] = [];

  parameterFilter: HelgolandParameterFilter = {
    type: DatasetType.Timeseries,
  };

  constructor() {
    this.selectedProviderList.push({
      id: '1',
      url: 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/',
      filter: {},
    });
  }

  onDatasetSelected(datasets: HelgolandDataset[]) {
    datasets.forEach((dataset) =>
      console.log(
        'Select Dataset: ' + dataset.label + ' with ID: ' + dataset.id,
      ),
    );
  }
}
