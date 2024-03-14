import { Injectable } from '@angular/core';
import {
  ColorService,
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  HelgolandTrajectory,
  LocalStorage,
  Timespan,
} from '@helgoland/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

const TRAJECTORY_ID_CACHE_PARAM = 'trajectoryId';

export interface TrajectoryResult {
  geometry: GeoJSON.LineString;
  trajectory: HelgolandTrajectory;
  datasetIds: string[];
  timespan: Timespan;
  options: Map<string, DatasetOptions>;
}

@Injectable({
  providedIn: 'root',
})
export class TrajectoriesService {
  public loading = new ReplaySubject<boolean>();
  public result = new ReplaySubject<TrajectoryResult>();
  private internalId!: string;

  constructor(
    private colorSrvc: ColorService,
    private localStorage: LocalStorage,
    private servicesConnector: HelgolandServicesConnector,
  ) {
    this.loadState();
  }

  public set mainTrajectoryId(id: string) {
    this.internalId = id;
    this.loadTrajectory();
  }

  public get mainTrajectoryId(): string {
    return this.internalId;
  }

  public loadTrajectory() {
    this.loading.next(true);
    this.servicesConnector
      .getDataset(this.internalId, { type: DatasetType.Trajectory })
      .subscribe((trajectory) => {
        if (trajectory.firstValue && trajectory.lastValue) {
          const from = new Date(trajectory.firstValue.timestamp);
          const to = new Date(trajectory.lastValue.timestamp);
          const timespan = new Timespan(from, to);
          forkJoin([
            this.getDatasetIds(trajectory),
            this.getGeometry(trajectory, timespan),
          ]).subscribe((res) => {
            const options: Map<string, DatasetOptions> = new Map();
            res[0].forEach((e) => {
              options.set(e, this.createStyles(e, this.internalId === e));
            });
            this.result.next({
              trajectory: trajectory,
              timespan,
              geometry: res[1],
              datasetIds: res[0],
              options,
            });
            this.saveState();
            this.loading.next(false);
          });
        } else {
          console.error("Trajectory doesn't have first and last value.");
        }
      });
  }

  private getGeometry(trajectory: HelgolandTrajectory, timespan: Timespan) {
    return this.servicesConnector.getDatasetData(trajectory, timespan).pipe(
      map((res) => {
        const geometry: GeoJSON.LineString = {
          type: 'LineString',
          coordinates: res.values.map((e) => e.geometry.coordinates),
        };
        return geometry;
      }),
    );
  }

  private getDatasetIds(trajectory: HelgolandTrajectory): Observable<string[]> {
    return this.servicesConnector
      .getDatasets(trajectory.url, {
        type: DatasetType.Trajectory,
        feature: trajectory.parameters.feature?.id,
      })
      .pipe(map((res) => res.map((e) => e.internalId)));
  }

  protected createStyles(internalId: string, visible: boolean): DatasetOptions {
    const option = new DatasetOptions(internalId, this.colorSrvc.getColor());
    option.visible = visible;
    return option;
  }

  protected saveState(): void {
    this.localStorage.save(TRAJECTORY_ID_CACHE_PARAM, this.internalId);
  }

  protected loadState(): void {
    this.internalId = this.localStorage.load(TRAJECTORY_ID_CACHE_PARAM);
    if (this.internalId) {
      this.loadTrajectory();
    }
  }
}
