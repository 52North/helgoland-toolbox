import { CommonModule } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  HelgolandService,
  HelgolandServicesConnector,
  Phenomenon,
} from "@helgoland/core";
import { HelgolandMapSelectorModule } from "@helgoland/map";
import { MultiServiceFilter, MultiServiceFilterEndpoint } from "@helgoland/selector";
import { TranslateModule } from "@ngx-translate/core";
import { ErrorHandlerService, ParameterListSelectorComponent } from "helgoland-common";
import { icon, Marker } from "leaflet";

import {
  ModalDatasetByStationSelectorComponent,
} from "../../components/modal-dataset-by-station-selector/modal-dataset-by-station-selector.component";
import { MapConfig, ModalMapSettingsComponent } from "../../components/modal-map-settings/modal-map-settings.component";
import { ConfigurationService } from "../../services/configuration.service";
import { DatasetsService } from "../../services/graph-datasets.service";
import { AppRouterService } from "./../../services/app-router.service";

Marker.prototype.options.icon = icon({
  iconRetinaUrl: 'assets/img/marker-icon-2x.png',
  iconUrl: 'assets/img/marker-icon.png',
  shadowUrl: 'assets/img/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

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
  standalone: true
})
export class MapSelectionComponent implements OnInit {

  selectedService: HelgolandService | undefined;

  stationFilter: HelgolandParameterFilter;

  phenomenonFilter: MultiServiceFilter[];

  selectedPhenomenonId: string;

  phenomenonEndpoint = MultiServiceFilterEndpoint.phenomenon;

  cluster = true;

  constructor(
    public appRouter: AppRouterService,
    public graphDatasetsSrvc: DatasetsService,
    private configSrvc: ConfigurationService,
    private serviceConnector: HelgolandServicesConnector,
    private errorHandler: ErrorHandlerService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    if (this.configSrvc.configuration) {
      this.serviceConnector.getServices(this.configSrvc.configuration?.defaultService.apiUrl).subscribe({
        next: services => {
          this.selectedService = services.find(e => e.id === this.configSrvc.configuration?.defaultService.serviceId);
          this.updateFilter();
        },
        error: error => this.errorHandler.error(error)
      })
    }
  }

  onStationSelected(station: HelgolandPlatform) {
    const dialogRef = this.dialog.open(ModalDatasetByStationSelectorComponent);
    dialogRef.componentInstance.station = station;
    dialogRef.componentInstance.url = this.selectedService.apiUrl;
    dialogRef.componentInstance.phenomenonId = this.selectedPhenomenonId;

    dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
      if (newConf) {
        this.cluster = newConf.cluster;
        this.selectedService = newConf.selectedService;
        this.updateFilter();
      }
    })
  }

  openMapSettings() {
    const conf: MapConfig = {
      cluster: this.cluster,
      selectedService: this.selectedService
    }
    const dialogRef = this.dialog.open(ModalMapSettingsComponent, { data: conf });
    dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
      if (newConf) {
        this.cluster = newConf.cluster;
        this.selectedService = newConf.selectedService;
        this.updateFilter();
      }
    })
  }

  selectAllPhenomena() {
    this.selectedPhenomenonId = null;
    this.updateFilter();
  }

  onPhenomenonSelected(phenomenon: Phenomenon) {
    this.selectedPhenomenonId = phenomenon.id;
    this.updateFilter();
  }

  private updateFilter() {
    this.stationFilter = {
      type: DatasetType.Timeseries,
      service: this.selectedService.id
    }
    if (this.selectedPhenomenonId) { this.stationFilter.phenomenon = this.selectedPhenomenonId; }

    this.phenomenonFilter = [{
      url: this.selectedService.apiUrl,
      filter: {
        service: this.selectedService.id
      }
    }]
  }

}
