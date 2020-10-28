import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HelgolandService, HelgolandServicesConnector, Parameter } from '@helgoland/core';
import { MultiServiceFilter } from '@helgoland/selector';

import { appConfig } from '../../app-config';
import { AppRouterService } from '../../services/app-router.service';
import { TimeseriesService } from '../../services/timeseries-service.service';
import { ListConfig, ModalListSettingsComponent } from './modal-list-settings/modal-list-settings.component';

export enum Filter {
  CATEGORY = 'category',
  FEATURE = 'feature',
  PHENOMENON = 'phenomenon',
  PROCEDURE = 'procedure',
  TIMESERIES = 'timeseries'
}

interface FilterListEntry {
  selectedFilter?: Filter;
  selectedItem?: Parameter;
  apiFilter: MultiServiceFilter[];
  expanded: boolean;
  possibleFilters: Filter[];
}

@Component({
  selector: 'helgoland-list-selection-view',
  templateUrl: './list-selection-view.component.html',
  styleUrls: ['./list-selection-view.component.scss']
})
export class ListSelectionViewComponent implements OnInit {

  public selectedService: HelgolandService;

  public activeFilterCount: number;

  public filterList: FilterListEntry[];

  constructor(
    private dialog: MatDialog,
    private serviceConnector: HelgolandServicesConnector,
    public appRouter: AppRouterService,
    public timeseries: TimeseriesService
  ) { }

  ngOnInit(): void {
    this.serviceConnector.getServices(appConfig.defaultService.apiUrl).subscribe(services => {
      this.selectedService = services.find(e => e.id === appConfig.defaultService.serviceId);
      this.resetView();
    });
  }

  openListSettings() {
    const conf: ListConfig = {
      selectedService: this.selectedService
    }
    const dialogRef = this.dialog.open(ModalListSettingsComponent, {
      data: conf,
      maxWidth: '100%'
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

  public selectFilter(entry: FilterListEntry, filter: Filter) {
    if (entry.selectedFilter === Filter.CATEGORY) {
      delete entry.apiFilter[0].filter.category;
    }
    if (entry.selectedFilter === Filter.FEATURE) {
      delete entry.apiFilter[0].filter.feature;
    }
    if (entry.selectedFilter === Filter.PHENOMENON) {
      delete entry.apiFilter[0].filter.phenomenon;
    }
    if (entry.selectedFilter === Filter.PROCEDURE) {
      delete entry.apiFilter[0].filter.procedure;
    }
    entry.selectedFilter = filter;
  }

  public itemSelected(filter: FilterListEntry, item: Parameter) {
    filter.selectedItem = item;
    filter.expanded = false;

    // find entry and clear following
    const fi = this.filterList.findIndex(e => e === filter);
    this.filterList.splice(fi + 1);

    const possibleFilters: Filter[] = []
    for (const f in Filter) {
      if (typeof f === 'string') {
        possibleFilters.push(Filter[f]);
      }
    }
    for (let index = 0; index < this.filterList.length; index++) {
      const f = this.filterList[index].selectedFilter;
      const idx = possibleFilters.findIndex(e => e === f);
      possibleFilters.splice(idx, 1);
    }

    // add new Entry
    const apiFilter: MultiServiceFilter[] = [...filter.apiFilter];
    switch (filter.selectedFilter) {
      case Filter.CATEGORY:
        apiFilter[0].filter.category = item.id
        break;
      case Filter.FEATURE:
        apiFilter[0].filter.feature = item.id
        break;
      case Filter.PHENOMENON:
        apiFilter[0].filter.phenomenon = item.id
        break;
      case Filter.PROCEDURE:
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
      possibleFilters: [Filter.CATEGORY, Filter.FEATURE, Filter.PHENOMENON, Filter.PROCEDURE],
      apiFilter: [{
        url: this.selectedService.apiUrl,
        filter: {
          service: this.selectedService.id
        }
      }]
    });
  }

}
