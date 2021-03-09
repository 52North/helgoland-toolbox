import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  DatasetApi,
  DatasetType,
  HelgolandParameterFilter,
  HelgolandService,
  HelgolandServicesConnector,
  Parameter,
} from '@helgoland/core';
import { MultiServiceFilter, MultiServiceFilterEndpoint } from '@helgoland/selector';

import {
  ParameterListEntry,
  ParameterType,
} from './../../../../../../libs/helgoland-common/src/lib/components/multi-parameter-selection/model';
import { ConfigurationService } from './../../services/configuration.service';
import { TrajectoriesService } from './../../services/trajectories.service';

@Component({
  selector: 'helgoland-trajectories-modal-trajectory-selection',
  templateUrl: './modal-trajectory-selection.component.html',
  styleUrls: ['./modal-trajectory-selection.component.scss']
})
export class ModalTrajectorySelectionComponent implements OnInit {

  public datasetApis: DatasetApi[] = this.configSrvc.configuration?.datasetApis;

  public filterList: ParameterListEntry[] = [];

  public providerFilter: HelgolandParameterFilter = {
    type: DatasetType.Trajectory,
    expanded: false
  }

  public filterEnpoints = MultiServiceFilterEndpoint;

  constructor(
    public dialogRef: MatDialogRef<ModalTrajectorySelectionComponent>,
    private configSrvc: ConfigurationService,
    private servicesConnector: HelgolandServicesConnector,
    private trajectorySrvc: TrajectoriesService
  ) { }

  ngOnInit(): void {
    this.filterList.push({
      selectedFilter: ParameterType.PROVIDER,
      expanded: true,
      possibleFilters: [],
      apiFilter: []
    });
  }

  public serviceSelected(service: HelgolandService) {
    this.filterList.splice(1);
    if (this.filterList.length > 0) {
      this.filterList[this.filterList.length - 1].expanded = false;
    }
    this.filterList.push({
      expanded: true,
      possibleFilters: [ParameterType.PLATFORM, ParameterType.OFFERING, ParameterType.PHENOMENON],
      apiFilter: [{
        url: service.apiUrl,
        filter: {
          service: service.id,
          type: DatasetType.Trajectory
        }
      }]
    });
  }

  public selectFilter(entry: ParameterListEntry, filter: ParameterType) {
    if (entry.selectedFilter === ParameterType.OFFERING) {
      delete entry.apiFilter[0].filter.offering;
    }
    if (entry.selectedFilter === ParameterType.PHENOMENON) {
      delete entry.apiFilter[0].filter.phenomenon;
    }
    if (entry.selectedFilter === ParameterType.FEATURE) {
      delete entry.apiFilter[0].filter.feature;
    }
    if (entry.selectedFilter === ParameterType.PLATFORM) {
      delete entry.apiFilter[0].filter.platform;
    }
    entry.selectedFilter = filter;
  }

  public itemSelected(filter: ParameterListEntry, item: Parameter) {
    filter.selectedItem = item;
    filter.expanded = false;

    // find entry and clear following
    const fi = this.filterList.findIndex(e => e === filter);
    this.filterList.splice(fi + 1);

    // add new Entry
    const apiFilter: MultiServiceFilter[] = [...filter.apiFilter];
    switch (filter.selectedFilter) {
      case ParameterType.OFFERING:
        apiFilter[0].filter.offering = item.id;
        break;
      case ParameterType.PHENOMENON:
        apiFilter[0].filter.phenomenon = item.id;
        break;
      case ParameterType.FEATURE:
        apiFilter[0].filter.feature = item.id;
        break;
      case ParameterType.PLATFORM:
        apiFilter[0].filter.platform = item.id;
        break;
      default:
        throw new Error(`not implemented for ${filter.selectedFilter}`);
    }
    const possibleFilters = [ParameterType.PLATFORM, ParameterType.OFFERING, ParameterType.PHENOMENON, ParameterType.FEATURE];
    for (let index = 0; index < this.filterList.length; index++) {
      const f = this.filterList[index].selectedFilter;
      const idx = possibleFilters.findIndex(e => e === f);
      if (idx >= 0) {
        possibleFilters.splice(idx, 1);
      }
    }
    this.filterList.push({
      expanded: true,
      possibleFilters,
      apiFilter,
      selectedFilter: possibleFilters.length === 1 ? possibleFilters[0] : null
    });
  }

  public featureSelected(filter: ParameterListEntry, item: Parameter) {
    const url = filter.apiFilter[0].url;
    const dsFilter = filter.apiFilter[0].filter;
    this.servicesConnector.getDatasets(url, dsFilter).subscribe(res => {
      if (res.length > 0) {
        this.trajectorySrvc.mainTrajectoryId = res[0].internalId;
        this.dialogRef.close();
      }
    })
  }

}
