import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTrajectory,
  LocatedTimeValueEntry,
  Timespan,
} from '@helgoland/core';
import { D3AxisType, D3GraphOptions, D3SelectionRange } from '@helgoland/d3';
import { TranslateService } from '@ngx-translate/core';

import { TrajectoriesService } from '../../services/trajectories.service';
import { TrajectoryViewPermalinkService } from './../../services/trajectory-view-permalink.service';
import { ModalMainConfigComponent } from './../modal-main-config/modal-main-config.component';
import { ModalTrajectorySelectionComponent } from './../modal-trajectory-selection/modal-trajectory-selection.component';

@Component({
  selector: 'helgoland-trajectories-view',
  templateUrl: './trajectory-view.component.html',
  styleUrls: ['./trajectory-view.component.scss']
})
export class TrajectoryViewComponent implements OnInit {

  public trajectory: HelgolandTrajectory;
  public timespan: Timespan;
  public selectedTimespan: Timespan;
  public geometry: GeoJSON.LineString;
  public highlightGeometry: GeoJSON.GeoJsonObject;
  public zoomToGeometry: GeoJSON.LineString;
  public graphData: LocatedTimeValueEntry[];
  public loading: boolean;
  public datasetIds: string[] = [];
  public options: Map<string, DatasetOptions>;
  public selection: D3SelectionRange;

  public graphOptions: D3GraphOptions = {
    axisType: D3AxisType.Time,
    dotted: false
  };

  public axisTypes = [
    { type: D3AxisType.Distance, label: this.translateSrvc.instant('chart-styling.xaxis-option.distance') },
    { type: D3AxisType.Time, label: this.translateSrvc.instant('chart-styling.xaxis-option.time') },
    { type: D3AxisType.Ticks, label: this.translateSrvc.instant('chart-styling.xaxis-option.ticks') }
  ]

  constructor(
    public trajectorySrvc: TrajectoriesService,
    public translateSrvc: TranslateService,
    public permalinkSrvc: TrajectoryViewPermalinkService,
    private dialog: MatDialog,
    private servicesConnector: HelgolandServicesConnector,
  ) { }

  ngOnInit(): void {
    this.permalinkSrvc.validatePeramlink().subscribe(_ => {
      this.initializeView();

      this.trajectorySrvc.datasetIdsChanged.subscribe((ids: string[]) => {
        if (ids.length > 0) {
          if (this.datasetIds.length === 0 || this.datasetIds[0] !== this.trajectorySrvc.mainTrajectoryId) {
            this.loadTrajectory(this.trajectorySrvc.mainTrajectoryId);
          }
        }
      })
    });
  }

  private initializeView() {
    const internalId = this.trajectorySrvc.mainTrajectoryId;
    if (!internalId) {
      this.openSelection(true);
    } else {
      this.loadTrajectory(internalId);
    }
  }

  private loadTrajectory(internalId: string) {
    this.loading = true;
    this.datasetIds = this.trajectorySrvc.datasetIds;
    this.options = this.trajectorySrvc.datasetOptions;
    this.servicesConnector.getDataset(internalId, { type: DatasetType.Trajectory }).subscribe(
      trajectory => {
        this.trajectory = trajectory;
        this.servicesConnector.getDatasets(trajectory.url, { type: DatasetType.Trajectory, feature: trajectory.parameters.feature.id }).subscribe(res => {
          res.forEach(e => {
            if (e.internalId !== internalId) {
              this.trajectorySrvc.addAdditionalDataset(e.internalId, { visible: false });
            }
          })
        });
        this.timespan = new Timespan(trajectory.firstValue.timestamp, trajectory.lastValue.timestamp);
        this.selectedTimespan = this.timespan;
        this.servicesConnector.getDatasetData(trajectory, this.timespan).subscribe(
          data => {
            this.geometry = {
              type: 'LineString',
              coordinates: []
            };
            this.graphData = data.values;
            data.values.forEach(entry => this.geometry.coordinates.push(entry.geometry.coordinates));
            this.loading = false;
          }
        );
      }
    );
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
    if (this.graphData) {
      const from = this.graphData[this.selection.from].timestamp;
      const to = this.selection.to < this.graphData.length ? this.graphData[this.selection.to].timestamp : this.timespan.to;
      this.selectedTimespan = new Timespan(from, to);
    }
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
    this.dialog.open(ModalTrajectorySelectionComponent, { disableClose });
  }

  public openMainConfig() {
    this.dialog.open(ModalMainConfigComponent);
  }

}
