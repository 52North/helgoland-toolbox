import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Time } from '@helgoland/core';
import { D3SeriesGraphComponent, D3SeriesGraphOptions, HoveringStyle } from '@helgoland/d3';

import {
  DiagramConfig,
  ModalDiagramSettingsComponent,
} from '../../components/modal-diagram-settings/modal-diagram-settings.component';
import { AppRouterService } from './../../services/app-router.service';
import { DatasetEntry, DatasetsService } from './../../services/graph-datasets.service';
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

  public diagramConfig: DiagramConfig = {
    overviewVisible: true,
    yaxisVisible: true,
    yaxisModifier: true,
    hoverstyle: HoveringStyle.point
  };

  public graphOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    hoverStyle: this.diagramConfig.hoverstyle,
    togglePanZoom: true,
    yaxisModifier: this.diagramConfig.yaxisModifier
  }

  public overviewOptions: D3SeriesGraphOptions = {
    showTimeLabel: false,
    yaxis: false,
    hoverStyle: HoveringStyle.none
  }

  public diagramLoading: boolean;
  public overviewLoading: boolean;

  @ViewChild('graph')
  private graph!: D3SeriesGraphComponent;

  @ViewChild('overview')
  private overview!: D3SeriesGraphComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private dialog: MatDialog,
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
    this.graphDatasetsSrvc.dataUpdated.subscribe(val => {
      this.overview.redrawCompleteGraph();
      this.graph.redrawCompleteGraph();
    });
  }

  public onDiagramLoading(loading: boolean) {
    setTimeout(() => this.diagramLoading = loading);
  }

  public onOverviewLoading(loading: boolean) {
    setTimeout(() => this.overviewLoading = loading);
  }

  selectionChanged(selection: string[]) {
    this.selectedIds = selection;
    this.graphDatasetsSrvc.setSelections(selection);
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
        this.graphOptions.hoverStyle = HoveringStyle[this.diagramConfig.hoverstyle];
        this.graphOptions.yaxis = this.diagramConfig.yaxisVisible;
        this.graphOptions.yaxisModifier = this.diagramConfig.yaxisModifier;
      }
    })
  }

  public jumpToDate(date: Date) {
    this.graphDatasetsSrvc.timespan = this.time.centerTimespan(this.graphDatasetsSrvc.timespan, date);
  }

  public clearSelection() {
    this.selectedIds = [];
    this.graphDatasetsSrvc.clearSelections();
  }

  public removeAllTimeseries() {
    this.graphDatasetsSrvc.deleteAllDatasets();
  }

  public datasetChanged(dataset: DatasetEntry) {
    this.graphDatasetsSrvc.datasetUpdated(dataset);
  }

  public deleteDataset(dataset: DatasetEntry) {
    this.graphDatasetsSrvc.deleteDataset(dataset.id);
  }

}
