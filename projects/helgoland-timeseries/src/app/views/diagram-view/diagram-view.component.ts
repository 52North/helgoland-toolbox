import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatasetOptions, Time } from '@helgoland/core';
import { D3PlotOptions, D3SeriesGraphComponent, HoveringStyle } from '@helgoland/d3';

import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import { AppRouterService } from './../../services/app-router.service';
import { DatasetEntry, DatasetsService } from './../../services/graph-datasets.service';
import { TimeseriesService } from './../../services/timeseries-service.service';
import { DiagramViewPermalinkService } from './diagram-view-permalink.service';

@Component({
  selector: 'helgoland-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramViewComponent implements OnInit {

  public mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  public selectedIds: string[] = [];

  public datasetOptions: Map<string, DatasetOptions> = new Map();

  public d3diagramOptions: D3PlotOptions = {
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

  public d3overviewOptions: D3PlotOptions = {
    overview: true,
    showTimeLabel: false
  };

  public diagramLoading: boolean;
  public overviewLoading: boolean;

  public diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: this.d3diagramOptions.yaxis,
    yaxisModifier: true,
    hoverstyle: this.d3diagramOptions.hoverStyle
  };

  // new implementation starts

  @ViewChild(D3SeriesGraphComponent)
  private d3Graph!: D3SeriesGraphComponent;

  // new implementation ends

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
    public timeseries: TimeseriesService,
    public appRouter: AppRouterService,
    public permalinkSrvc: DiagramViewPermalinkService,
    private time: Time,
    public graphDatasetsSrvc: DatasetsService
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

    // new implementation starts
    this.graphDatasetsSrvc.dataUpdated.subscribe(val => this.d3Graph.redrawCompleteGraph());
    // new implementation ends
  }

  // public setSelected(selectedIds: string[]) {
  //   this.selectedIds = selectedIds;
  // }

  public onDiagramLoading(loading: boolean) {
    setTimeout(() => this.diagramLoading = loading);
  }

  public onOverviewLoading(loading: boolean) {
    setTimeout(() => this.overviewLoading = loading);
  }

  public openDiagramSettings() {
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
        this.d3diagramOptions.hoverStyle = HoveringStyle[this.diagramConfig.hoverstyle];
        this.d3diagramOptions.yaxis = this.diagramConfig.yaxisVisible;
      }
    })
  }

  public jumpToDate(date: Date) {
    this.graphDatasetsSrvc.timespan = this.time.centerTimespan(this.graphDatasetsSrvc.timespan, date);
  }

  public clearSelection() {
    debugger;
    // this.selectedIds = [];
  }

  public removeAllTimeseries() {
    this.graphDatasetsSrvc.deleteAllDatasets();
  }

  public datasetChanged(dataset: DatasetEntry) {
    this.graphDatasetsSrvc.datasetUpdated(dataset);
  }

  public deleteDataset(dataset: DatasetEntry) {
    this.graphDatasetsSrvc.deleteDataset(dataset);
  }

}
