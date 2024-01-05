import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  HelgolandServicesConnector,
  Phenomenon,
} from '@helgoland/core';
import { HelgolandMapSelectorModule, MapCache } from '@helgoland/map';
import {
  MultiServiceFilter,
  MultiServiceFilterEndpoint,
} from '@helgoland/selector';
import { TranslateModule } from '@ngx-translate/core';
import {
  ErrorHandlerService,
  ParameterListSelectorComponent,
} from 'helgoland-common';
import { MarkerClusterGroupOptions } from 'leaflet';

import {
  AppConfig,
  ConfigurationService,
} from '../../services/configuration.service';
import { ModalDatasetByStationSelectorComponent } from '../modal-dataset-by-station-selector/modal-dataset-by-station-selector.component';
import {
  MapConfig,
  ModalMapSettingsComponent,
} from '../modal-map-settings/modal-map-settings.component';
import { MapSelectionStateService } from './map-selection-state.service';

interface MapSelectionAppConfig extends AppConfig {
  mapSelectionClusterConfig: MarkerClusterGroupOptions;
}

@Component({
  selector: 'helgoland-map-selection',
  templateUrl: './map-selection.component.html',
  styleUrls: ['./map-selection.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    HelgolandMapSelectorModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatTooltipModule,
    ParameterListSelectorComponent,
    TranslateModule,
  ],
  standalone: true,
})
export class MapSelectionComponent implements OnInit, AfterViewInit {
  @ViewChild('drawer') drawer: MatDrawer | undefined;

  mapId = 'timeseries';

  stationFilter: HelgolandParameterFilter | undefined;

  clusterConfig: MarkerClusterGroupOptions | undefined;

  phenomenonFilter: MultiServiceFilter[] = [];

  phenomenonEndpoint = MultiServiceFilterEndpoint.phenomenon;

  cluster = true;

  constructor(
    private configSrvc: ConfigurationService<MapSelectionAppConfig>,
    private serviceConnector: HelgolandServicesConnector,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
    private mapCache: MapCache,
    public state: MapSelectionStateService,
  ) {}

  ngAfterViewInit(): void {
    this.drawer?.openedChange.subscribe((_) => {
      const map = this.mapCache.getMap(this.mapId);
      if (map) {
        map.invalidateSize();
      }
    });
  }

  ngOnInit() {
    if (
      !this.state.selectedService &&
      this.configSrvc.configuration.defaultService
    ) {
      this.serviceConnector
        .getServices(this.configSrvc.configuration?.defaultService.apiUrl)
        .subscribe({
          next: (services) => {
            this.state.selectedService = services.find(
              (e) =>
                e.id ===
                this.configSrvc.configuration?.defaultService!.serviceId,
            );
            this.updateFilter();
          },
          error: (error) => this.errorHandler.error(error),
        });
    } else {
      this.updateFilter();
    }
    this.clusterConfig =
      this.configSrvc.configuration.mapSelectionClusterConfig;
  }

  phenomenonToggled() {
    this.drawer?.toggle();
  }

  onStationSelected(station: HelgolandPlatform) {
    if (this.state.selectedService) {
      const dialogRef = this.dialog.open(
        ModalDatasetByStationSelectorComponent,
      );
      dialogRef.componentInstance.station = station;
      dialogRef.componentInstance.url = this.state.selectedService.apiUrl;
      dialogRef.componentInstance.phenomenonId =
        this.state.selectedPhenomenonId;

      dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
        if (newConf) {
          this.cluster = newConf.cluster;
          this.state.selectedService = newConf.selectedService;
          this.updateFilter();
        }
      });
    }
  }

  openMapSettings() {
    if (this.state.selectedService) {
      const conf: MapConfig = {
        cluster: this.cluster,
        selectedService: this.state.selectedService,
      };
      const dialogRef = this.dialog.open(ModalMapSettingsComponent, {
        data: conf,
      });
      dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
        if (newConf) {
          this.cluster = newConf.cluster;
          this.state.selectedService = newConf.selectedService;
          this.state.selectedPhenomenonId = undefined;
          this.updateFilter();
        }
      });
    }
  }

  selectAllPhenomena() {
    this.state.selectedPhenomenonId = undefined;
    this.updateFilter();
  }

  onPhenomenonSelected(phenomenon: Phenomenon) {
    this.state.selectedPhenomenonId = phenomenon.id;
    this.updateFilter();
  }

  private updateFilter() {
    if (this.state.selectedService) {
      this.stationFilter = {
        type: DatasetType.Timeseries,
        service: this.state.selectedService.id,
      };
      if (this.state.selectedPhenomenonId) {
        this.stationFilter.phenomenon = this.state.selectedPhenomenonId;
      }

      this.phenomenonFilter = [
        {
          url: this.state.selectedService.apiUrl,
          filter: {
            service: this.state.selectedService.id,
          },
        },
      ];
    }
  }
}
