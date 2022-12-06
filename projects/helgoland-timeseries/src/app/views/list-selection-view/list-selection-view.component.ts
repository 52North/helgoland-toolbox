import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DatasetType, HelgolandService, HelgolandServicesConnector, Parameter } from '@helgoland/core';
import { MultiServiceFilterEndpoint } from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';
import {
  ErrorHandlerService,
  FilterLabelComponent,
  ParameterListEntry,
  ParameterListSelectorComponent,
  ParameterType,
} from 'helgoland-common';

import {
  ModalMainConfigButtonComponent,
} from '../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import {
  TimeseriesListSelectorComponent,
} from '../../components/timeseries-list-selector/timeseries-list-selector.component';
import { AppRouterService } from '../../services/app-router.service';
import { TimeseriesService } from '../../services/timeseries-service.service';
import { DIALOG_MAX_WIDTH } from './../../constants/layout';
import { ConfigurationService } from './../../services/configuration.service';
import { ListConfig, ModalListSettingsComponent } from './modal-list-settings/modal-list-settings.component';

@Component({
  selector: 'helgoland-list-selection-view',
  templateUrl: './list-selection-view.component.html',
  styleUrls: ['./list-selection-view.component.scss'],
  imports: [
    CommonModule,
    FilterLabelComponent,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    ModalMainConfigButtonComponent,
    ParameterListSelectorComponent,
    TimeseriesListSelectorComponent,
    TranslateModule,
  ],
  standalone: true
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
    private configSrvc: ConfigurationService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit(): void {
    if (this.configSrvc.configuration) {
      this.serviceConnector.getServices(this.configSrvc.configuration.defaultService.apiUrl).subscribe({
        next: services => {
          this.selectedService = services.find(e => e.id === this.configSrvc.configuration?.defaultService.serviceId);
          this.resetView();
        },
        error: error => this.errorHandler.error(error)
      });
    }
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
    const copy = JSON.parse(JSON.stringify(filter.apiFilter[0]));
    switch (filter.selectedFilter) {
      case ParameterType.CATEGORY:
        copy.filter.category = item.id
        break;
      case ParameterType.FEATURE:
        copy.filter.feature = item.id
        break;
      case ParameterType.PHENOMENON:
        copy.filter.phenomenon = item.id
        break;
      case ParameterType.PROCEDURE:
        copy.filter.procedure = item.id
        break;
    }
    this.filterList.push({
      expanded: true,
      possibleFilters,
      apiFilter: [copy]
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
