import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatasetOptions, HelgolandTrajectory, Timespan } from '@helgoland/core';
import { D3AxisType, D3GraphOptions, D3SelectionRange, HelgolandD3Module } from '@helgoland/d3';
import { HelgolandMapViewModule } from '@helgoland/map';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingOverlayProgressBarComponent, LoadingOverlaySpinnerComponent, ShareButtonComponent } from 'helgoland-common';

import { TrajectoriesService } from '../../services/trajectories.service';
import { LegendEntryComponent } from '../legend-entry/legend-entry.component';
import { TrajectoryViewPermalinkService } from './../../services/trajectory-view-permalink.service';
import { ModalMainConfigComponent } from './../modal-main-config/modal-main-config.component';
import { ModalTrajectorySelectionComponent } from './../modal-trajectory-selection/modal-trajectory-selection.component';
import { TrajectoryLabelComponent } from './../trajectory-label/trajectory-label.component';

@Component({
  selector: 'helgoland-trajectories-view',
  templateUrl: './trajectory-view.component.html',
  styleUrls: ['./trajectory-view.component.scss'],
  imports: [
    CommonModule,
    HelgolandD3Module,
    HelgolandMapViewModule,
    LegendEntryComponent,
    LoadingOverlayProgressBarComponent,
    LoadingOverlaySpinnerComponent,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    ShareButtonComponent,
    TrajectoryLabelComponent,
    TranslateModule,
  ],
  standalone: true
})
export class TrajectoryViewComponent implements OnInit {

  public trajectory: HelgolandTrajectory;
  public timespan: Timespan;
  public selectedTimespan: Timespan;
  public geometry: GeoJSON.LineString;
  public highlightGeometry: GeoJSON.GeoJsonObject;
  public zoomToGeometry: GeoJSON.LineString;
  public loading: boolean;
  public datasetIds: string[] = [];
  public options: Map<string, DatasetOptions>;
  public selection: D3SelectionRange;

  public graphOptions: D3GraphOptions = {
    axisType: D3AxisType.Time,
    dotted: false,
    groupYAxis: true
  };
  public trajectoryGraphLoading: boolean;

  public axisTypes = [
    { type: D3AxisType.Distance, label: this.translateSrvc.instant('chart-styling.xaxis-option.distance') },
    { type: D3AxisType.Time, label: this.translateSrvc.instant('chart-styling.xaxis-option.time') },
    { type: D3AxisType.Ticks, label: this.translateSrvc.instant('chart-styling.xaxis-option.ticks') }
  ]

  constructor(
    public trajectorySrvc: TrajectoriesService,
    public translateSrvc: TranslateService,
    public permalinkSrvc: TrajectoryViewPermalinkService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.permalinkSrvc.validatePeramlink().subscribe(_ => {
      this.initializeView();
    });

    this.trajectorySrvc.loading.subscribe(loading => this.loading = loading);
    this.trajectorySrvc.result.subscribe(res => {
      this.trajectory = res.trajectory;
      this.timespan = res.timespan;
      this.geometry = res.geometry;
      this.datasetIds = res.datasetIds;
      this.options = res.options;
    })
  }

  private initializeView() {
    if (!this.trajectorySrvc.mainTrajectoryId) {
      this.openSelection(true);
    }
  }

  public onChartSelectionChanged(range: D3SelectionRange) {
    this.highlightGeometry = {
      type: 'LineString',
      coordinates: this.geometry.coordinates.slice(range.from, range.to)
    } as GeoJSON.GeoJsonObject;
  }

  public onChartSelectionChangedFinished(range: D3SelectionRange) {
    console.log('Range finished: ' + range.from + ' ' + range.to);
    this.selection = range;
    this.zoomToGeometry = {
      type: 'LineString',
      coordinates: this.geometry.coordinates.slice(range.from, range.to)
    };
  }

  public onChartHighlightChanged(idx: number) {
    this.highlightGeometry = {
      type: 'Point',
      coordinates: this.geometry.coordinates[idx]
    } as GeoJSON.GeoJsonObject;
  }

  public setXaxisType(axisType: D3AxisType) {
    this.graphOptions.axisType = axisType;
  }

  public isXaxisTypeSelected(axisType: D3AxisType): boolean {
    return this.graphOptions.axisType === axisType;
  }

  public toggleDotted() {
    this.graphOptions.dotted = !this.graphOptions.dotted;
  }

  public openSelection(disableClose = false) {
    this.dialog.open(ModalTrajectorySelectionComponent, { disableClose, autoFocus: false });
  }

  public openMainConfig() {
    this.dialog.open(ModalMainConfigComponent);
  }

  public setGraphLoading(loading: boolean) {
    setTimeout(() => this.trajectoryGraphLoading = loading);
  }

}
