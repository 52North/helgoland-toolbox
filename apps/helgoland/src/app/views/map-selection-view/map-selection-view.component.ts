import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DatasetType,
  HelgolandParameterFilter,
  HelgolandPlatform,
  HelgolandService,
  HelgolandServicesConnector,
  Phenomenon,
} from '@helgoland/core';
import { MultiServiceFilter, MultiServiceFilterEndpoint } from '@helgoland/selector';
import { icon, Marker } from 'leaflet';

import {
  ModalDatasetByStationSelectorComponent,
} from '../../components/modal-dataset-by-station-selector/modal-dataset-by-station-selector.component';
import { MapConfig, ModalMapSettingsComponent } from '../../components/modal-map-settings/modal-map-settings.component';
import { DIALOG_MAX_WIDTH } from './../../constants/layout';
import { AppRouterService } from './../../services/app-router.service';
import { ConfigurationService } from './../../services/configuration.service';
import { TimeseriesService } from './../../services/timeseries-service.service';

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
  selector: 'helgoland-map-selection-view',
  templateUrl: './map-selection-view.component.html',
  styleUrls: ['./map-selection-view.component.scss']
})
export class MapSelectionViewComponent implements OnInit {

  public mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public selectedService: HelgolandService;
  public selectedPhenomenonId: string;

  public stationFilter: HelgolandParameterFilter;
  public phenomenonFilter: MultiServiceFilter[];

  public phenomenonEndpoint = MultiServiceFilterEndpoint.phenomenon;

  public cluster = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    private serviceConnector: HelgolandServicesConnector,
    public appRouter: AppRouterService,
    public timeseries: TimeseriesService,
    private configSrvc: ConfigurationService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.serviceConnector.getServices(this.configSrvc.configuration?.defaultService.apiUrl).subscribe(services => {
      this.selectedService = services.find(e => e.id === this.configSrvc.configuration?.defaultService.serviceId);
      this.updateFilter();
    });
  }

  public onStationSelected(station: HelgolandPlatform) {
    const dialogRef = this.dialog.open(ModalDatasetByStationSelectorComponent, { maxWidth: DIALOG_MAX_WIDTH });
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

  public openMapSettings() {
    const conf: MapConfig = {
      cluster: this.cluster,
      selectedService: this.selectedService
    }
    const dialogRef = this.dialog.open(ModalMapSettingsComponent, {
      data: conf,
      maxWidth: DIALOG_MAX_WIDTH
    });

    dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
      if (newConf) {
        this.cluster = newConf.cluster;
        this.selectedService = newConf.selectedService;
        this.updateFilter();
      }
    })
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.selectedPhenomenonId = phenomenon.id;
    this.updateFilter();
  }

  public selectAllPhenomena() {
    this.selectedPhenomenonId = null;
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
