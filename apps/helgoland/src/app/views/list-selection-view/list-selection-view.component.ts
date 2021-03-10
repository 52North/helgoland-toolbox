import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetType, HelgolandService, HelgolandServicesConnector, Parameter } from '@helgoland/core';
import { MultiServiceFilter, MultiServiceFilterEndpoint } from '@helgoland/selector';

import {
  ParameterListEntry,
  ParameterType,
} from '../../../../../../libs/helgoland-common/src/lib/components/multi-parameter-selection/model';
import { AppRouterService } from '../../services/app-router.service';
import { TimeseriesService } from '../../services/timeseries-service.service';
import { DIALOG_MAX_WIDTH } from './../../constants/layout';
import { ConfigurationService } from './../../services/configuration.service';
import { ListConfig, ModalListSettingsComponent } from './modal-list-settings/modal-list-settings.component';

@Component({
  selector: 'helgoland-list-selection-view',
  templateUrl: './list-selection-view.component.html',
  styleUrls: ['./list-selection-view.component.scss']
})
export class ListSelectionViewComponent implements OnInit {

  public selectedService: HelgolandService;

  public activeFilterCount: number;

  public filterList: ParameterListEntry[];

  public filterEndpoints = MultiServiceFilterEndpoint;

  constructor(
    private dialog: MatDialog,
    private serviceConnector: HelgolandServicesConnector,
    public appRouter: AppRouterService,
    public timeseries: TimeseriesService,
    private configSrvc: ConfigurationService
  ) { }

  ngOnInit(): void {
    this.serviceConnector.getServices(this.configSrvc.configuration?.defaultService.apiUrl).subscribe(services => {
      this.selectedService = services.find(e => e.id === this.configSrvc.configuration?.defaultService.serviceId);
      this.resetView();
    });
  }

  openListSettings() {
    const conf: ListConfig = {
      selectedService: this.selectedService
    }
    const dialogRef = this.dialog.open(ModalListSettingsComponent, {
      data: conf,
      maxWidth: DIALOG_MAX_WIDTH
    });

    dialogRef.afterClosed().subscribe((newConf: ListConfig) => {
      if (newConf) {
        if (this.selectedService.id !== newConf.selectedService.id || this.selectedService.apiUrl !== newConf.selectedService.apiUrl) {
          this.selectedService = newConf.selectedService;
          this.resetView();
        }
      }
    })
  }

  public selectFilter(entry: ParameterListEntry, filter: ParameterType) {
    if (entry.selectedFilter === ParameterType.CATEGORY) {
      delete entry.apiFilter[0].filter.category;
    }
    if (entry.selectedFilter === ParameterType.FEATURE) {
      delete entry.apiFilter[0].filter.feature;
    }
    if (entry.selectedFilter === ParameterType.PHENOMENON) {
      delete entry.apiFilter[0].filter.phenomenon;
    }
    if (entry.selectedFilter === ParameterType.PROCEDURE) {
      delete entry.apiFilter[0].filter.procedure;
    }
    entry.selectedFilter = filter;
  }

  public itemSelected(filter: ParameterListEntry, item: Parameter) {
    filter.selectedItem = item;
    filter.expanded = false;

    // find entry and clear following
    const fi = this.filterList.findIndex(e => e === filter);
    this.filterList.splice(fi + 1);

    const possibleFilters: ParameterType[] = [ParameterType.CATEGORY, ParameterType.FEATURE, ParameterType.PHENOMENON, ParameterType.PROCEDURE, ParameterType.TIMESERIES];
    for (let index = 0; index < this.filterList.length; index++) {
      const f = this.filterList[index].selectedFilter;
      const idx = possibleFilters.findIndex(e => e === f);
      possibleFilters.splice(idx, 1);
    }

    // add new Entry
    const apiFilter: MultiServiceFilter[] = [...filter.apiFilter];
    switch (filter.selectedFilter) {
      case ParameterType.CATEGORY:
        apiFilter[0].filter.category = item.id
        break;
      case ParameterType.FEATURE:
        apiFilter[0].filter.feature = item.id
        break;
      case ParameterType.PHENOMENON:
        apiFilter[0].filter.phenomenon = item.id
        break;
      case ParameterType.PROCEDURE:
        apiFilter[0].filter.procedure = item.id
        break;
    }
    this.filterList.push({
      expanded: true,
      possibleFilters,
      apiFilter
    });
  }

  private resetView() {
    this.filterList = [];
    this.filterList.push({
      expanded: true,
      possibleFilters: [ParameterType.CATEGORY, ParameterType.FEATURE, ParameterType.PHENOMENON, ParameterType.PROCEDURE],
      apiFilter: [{
        url: this.selectedService.apiUrl,
        filter: {
          service: this.selectedService.id,
          type: DatasetType.Timeseries
        }
      }]
    });
  }

}
