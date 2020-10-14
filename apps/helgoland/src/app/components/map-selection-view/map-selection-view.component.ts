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

import { appConfig } from './../../../environments/environment';
import { AppRouterService } from './../../services/app-router.service';
import { MapConfig, ModalMapSettingsComponent } from './../modal-map-settings/modal-map-settings.component';

@Component({
  selector: 'helgoland-toolbox-map-selection-view',
  templateUrl: './map-selection-view.component.html',
  styleUrls: ['./map-selection-view.component.scss']
})
export class MapSelectionViewComponent implements OnInit {

  public mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public selectedService: HelgolandService;
  public selectedPhenomenonId: string;

  public stationFilter: HelgolandParameterFilter;

  public cluster = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    private serviceConnector: HelgolandServicesConnector,
    public appRouter: AppRouterService,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.serviceConnector.getServices(appConfig.defaultService.apiUrl).subscribe(services => {
      this.selectedService = services.find(e => e.id === appConfig.defaultService.serviceId);
      this.updateStationFilter();
    });
  }

  public onStationSelected(station: HelgolandPlatform) {
    debugger;
    // this.station = station;
    // this.modalService.open(this.modalTemplate);
  }

  public openMapSettings() {
    const conf: MapConfig = {
      cluster: this.cluster,
      selectedService: this.selectedService
    }
    const dialogRef = this.dialog.open(ModalMapSettingsComponent, { data: conf });

    dialogRef.afterClosed().subscribe((newConf: MapConfig) => {
      if (newConf) {
        this.cluster = newConf.cluster;
        this.selectedService = newConf.selectedService;
      }
    })
  }

  public onPhenomenonSelected(phenomenon: Phenomenon) {
    this.selectedPhenomenonId = phenomenon.id;
    this.updateStationFilter();
  }

  public selectAllPhenomena() {
    this.selectedPhenomenonId = null;
    this.updateStationFilter();
  }

  private updateStationFilter() {
    this.stationFilter = {
      type: DatasetType.Timeseries,
      service: this.selectedService.id
    }
    if (this.selectedPhenomenonId) { this.stationFilter.phenomenon = this.selectedPhenomenonId; }
  }

}
