import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatasetOptions, Time } from '@helgoland/core';
import { D3PlotOptions, HelgolandD3Module, HoveringStyle } from '@helgoland/d3';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingOverlayProgressBarComponent, ShareButtonComponent } from 'helgoland-common';

import {
  ModalFavoriteListButtonComponent,
} from '../../components/favorites/modal-favorite-list-button/modal-favorite-list-button.component';
import { LegendEntryComponent } from '../../components/legend-entry/legend-entry.component';
import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import {
  ModalEditTimeseriesOptionsComponent,
} from '../../components/modal-edit-timeseries-options/modal-edit-timeseries-options.component';
import {
  GeneralTimeSelectionComponent,
} from '../../components/time/general-time-selection/general-time-selection.component';
import { AppRouterService } from '../../services/app-router.service';
import {
  ModalMainConfigButtonComponent,
} from './../../components/main-config/modal-main-config-button/modal-main-config-button.component';
import { TimeseriesService } from './../../services/timeseries-service.service';
import { DiagramViewPermalinkService } from './diagram-view-permalink.service';

@Component({
  selector: 'helgoland-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    GeneralTimeSelectionComponent,
    HelgolandD3Module,
    LegendEntryComponent,
    LoadingOverlayProgressBarComponent,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    ModalFavoriteListButtonComponent,
    ModalMainConfigButtonComponent,
    ShareButtonComponent,
    TranslateModule,
  ],
  standalone: true
})
export class DiagramViewComponent implements OnInit {

  mobileQuery: MediaQueryList;

  // private _mobileQueryListener: () => void;

  datasetIds: string[] = [];

  selectedIds: string[] = [];

  datasetOptions: Map<string, DatasetOptions> = new Map();

  d3diagramOptions: D3PlotOptions = {
    showReferenceValues: true,
    togglePanZoom: true,
    generalizeAllways: true,
    yaxis: true, // configurable
    showTimeLabel: false,
    hoverStyle: HoveringStyle.point,
    copyright: {
      label: '',
      link: 'https://52north.org/',
      positionX: 'right',
      positionY: 'bottom'
    },
    groupYaxis: true
  };

  d3overviewOptions: D3PlotOptions = {
    overview: true,
    showTimeLabel: false
  };

  diagramLoading: boolean = false;
  overviewLoading: boolean = false;

  diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: this.d3diagramOptions.yaxis!,
    yaxisModifier: true,
    hoverstyle: this.d3diagramOptions.hoverStyle!
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    private appRouter: AppRouterService,
    public timeseries: TimeseriesService,
    public permalinkSrvc: DiagramViewPermalinkService,
    private time: Time
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 1024px)');
    // this._mobileQueryListener = () => {
    //   debugger;
    //   return this.changeDetectorRef.detectChanges();
    // };
    // this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  // ngOnDestroy(): void {
  //   this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  // }

  ngOnInit(): void {
    this.permalinkSrvc.validatePeramlink();
    this.timeseries.datasetIdsChanged.subscribe(list => this.setDatasets());
    this.setDatasets();

    if (!this.timeseries.hasDatasets()) {
      this.openMapSelection();
    }
  }

  setSelected(selectedIds: string[]) {
    this.selectedIds = selectedIds;
  }

  onDiagramLoading(loading: boolean) {
    setTimeout(() => this.diagramLoading = loading);
  }

  onOverviewLoading(loading: boolean) {
    setTimeout(() => this.overviewLoading = loading);
  }

  openDiagramSettings() {
    const dialogRef = this.dialog.open(ModalDiagramSettingsComponent, {
      data: {
        overviewVisible: this.diagramConfig.overviewVisible,
        yaxisVisible: this.diagramConfig.yaxisVisible,
        yaxisModifier: this.diagramConfig.yaxisModifier,
        hoverstyle: this.diagramConfig.hoverstyle
      } as DiagramConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.diagramConfig = result;
        this.d3diagramOptions.hoverStyle = this.diagramConfig.hoverstyle;
        this.d3diagramOptions.yaxis = this.diagramConfig.yaxisVisible;
      }
    })
  }

  jumpToDate(date: Date) {
    this.timeseries.timespan = this.time.centerTimespan(this.timeseries.timespan, date);
  }

  isSelected(internalId: string): boolean {
    return !!this.selectedIds.find(e => e === internalId);
  }

  selectTimeseries(selected: boolean, internalId: string) {
    if (selected) {
      this.selectedIds.push(internalId);
    } else {
      this.selectedIds.splice(this.selectedIds.findIndex(entry => entry === internalId), 1);
    }
  }

  showGeometry(geometry: GeoJSON.GeoJsonObject) { }

  clearSelection() {
    this.selectedIds = [];
  }

  removeAllTimeseries() {
    this.timeseries.removeAllDatasets();
  }

  deleteTimeseries(internalId: string) {
    this.timeseries.removeDataset(internalId);
  }

  editOption(options: DatasetOptions) {
    const dialogRef = this.dialog.open(ModalEditTimeseriesOptionsComponent, { data: options });
    dialogRef.afterClosed().subscribe(_ => this.timeseries.updateDatasetOptions(options, options.internalId))
  }

  updateOptions(options: DatasetOptions, internalId: string) {
    this.timeseries.updateDatasetOptions(options, internalId);
  }

  openMapSelection() {
    this.appRouter.toMapSelection();
  }

  openListSelection() {
    this.appRouter.toListSelection();
  }

  private setDatasets() {
    this.datasetIds = this.timeseries.datasetIds;
    this.datasetOptions = this.timeseries.datasetOptions;
  }

}
