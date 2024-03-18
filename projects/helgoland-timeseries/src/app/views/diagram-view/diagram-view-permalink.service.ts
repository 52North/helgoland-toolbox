import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  DefinedTimespan,
  DefinedTimespanService,
  Timespan,
} from '@helgoland/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
  DATASET_STATE_SERVICE_INJECTION,
  DatasetStateService,
} from '../../services/service-interfaces';
import { DatasetsService } from './../../services/graph-datasets.service';

const PARAM_IDS = 'ids';
const ID_SEPERATOR = '!!';
const PARAM_TIME = 'time';
const TIME_SEPERATOR = '|';
const PARAM_DEFINED_TIME = 'defined_time';

@Injectable({
  providedIn: 'root',
})
export class DiagramViewInitStateService {
  constructor(
    private graphDatasetsSrvc: DatasetsService,
    private activatedRoute: ActivatedRoute,
    private definedTimeintervalSrvc: DefinedTimespanService,
    @Optional()
    @Inject(DATASET_STATE_SERVICE_INJECTION)
    private datasetStateServices: DatasetStateService[] | undefined,
  ) {
    if (this.datasetStateServices === null) {
      this.datasetStateServices = [];
    }
  }

  public preloadDatasets(): Observable<boolean> {
    return this.activatedRoute.queryParams.pipe(
      mergeMap((params) => this.handleParams(params)),
    );
  }

  private handleParams(params: Params): Observable<boolean> {
    this.handleTimeParam(params);
    if (params[PARAM_IDS]) {
      this.graphDatasetsSrvc.deleteAllDatasets();
      const ids = (params[PARAM_IDS] as string).split(ID_SEPERATOR);
      this.datasetStateServices?.forEach((pls) => pls.validatePermaIds(ids));
      return of(false);
    } else {
      const loadDatasets = this.datasetStateServices?.map((pls) =>
        pls.loadCachedDatasets(),
      );
      if (loadDatasets) {
        return forkJoin(loadDatasets).pipe(map((res) => res.some((r) => r)));
      }
      return of(false);
    }
  }

  private handleTimeParam(params: Params) {
    if (params[PARAM_TIME]) {
      const time = (params[PARAM_TIME] as string).split(TIME_SEPERATOR);
      if (time.length === 2) {
        const start = parseInt(time[0], 10);
        const end = parseInt(time[1], 10);
        this.graphDatasetsSrvc.timespan = new Timespan(start, end);
      }
    } else if (params[PARAM_DEFINED_TIME]) {
      const definedTime = params[PARAM_DEFINED_TIME] as DefinedTimespan;
      const timespan = this.definedTimeintervalSrvc.getInterval(definedTime);
      if (timespan) {
        this.graphDatasetsSrvc.timespan = timespan;
      }
    }
  }

  public generatePermalink = () => {
    let paramUrl = '';
    if (this.graphDatasetsSrvc.hasDatasets()) {
      const ids: string[] = [];
      this.datasetStateServices?.forEach((pls) => {
        pls.getPermaIds().forEach((id) => ids.push(id));
      });
      const id = ids.join(ID_SEPERATOR);
      paramUrl =
        this.createBaseUrl() + '?' + PARAM_IDS + '=' + encodeURIComponent(id);
      if (this.graphDatasetsSrvc.timespan) {
        paramUrl =
          paramUrl +
          '&' +
          PARAM_TIME +
          '=' +
          encodeURIComponent(
            this.graphDatasetsSrvc.timespan.from +
              TIME_SEPERATOR +
              this.graphDatasetsSrvc.timespan.to,
          );
      }
    }
    return paramUrl;
  };

  protected createBaseUrl() {
    const url = window.location.href;
    if (url.indexOf('?') !== -1) {
      return url.substring(0, url.indexOf('?'));
    } else {
      return url;
    }
  }
}
