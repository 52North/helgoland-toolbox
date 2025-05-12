import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  DefinedTimespan,
  DefinedTimespanService,
  Timespan,
} from '@helgoland/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { NotifierService } from '../../services/notifier.service';
import {
  DATASET_STATE_SERVICE_INJECTION,
  DatasetStateService,
} from '../../services/service-interfaces';
import { StorageService } from '../../services/storage-service.service';
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
    private storageSrvc: StorageService,
    protected notifier: NotifierService,
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
    const timespan = this.createTimespan(params);
    this.graphDatasetsSrvc.initTimespan(timespan);

    if (params[PARAM_IDS]) {
      this.graphDatasetsSrvc.deleteAllDatasets(true);
      const ids = (params[PARAM_IDS] as string).split(ID_SEPERATOR);
      let foundOne = false;
      ids.forEach((id) => {
        this.datasetStateServices?.some((dss) => {
          const handled = dss.validatePermaId(id);
          if (handled) {
            foundOne = true;
          }
        });
      });
      this.removeQueryParam(PARAM_IDS);
      return of(foundOne);
    } else {
      const ids = this.storageSrvc.loadOrder();
      let foundOne = false;
      ids?.forEach((id) => {
        this.datasetStateServices?.some((dss) => {
          const handled = dss.handleStoredDs(id);
          if (handled) {
            foundOne = true;
          }
        });
      });
      return of(foundOne);
    }
  }

  private createTimespan(params: Params): Timespan | undefined {
    if (params[PARAM_TIME]) {
      const time = (params[PARAM_TIME] as string).split(TIME_SEPERATOR);
      if (time.length === 2) {
        const start = parseInt(time[0], 10);
        const end = parseInt(time[1], 10);
        this.removeQueryParam(PARAM_TIME);
        return new Timespan(start, end);
      }
    } else if (params[PARAM_DEFINED_TIME]) {
      const definedTime = params[PARAM_DEFINED_TIME] as DefinedTimespan;
      const timespan = this.definedTimeintervalSrvc.getInterval(definedTime);
      if (timespan) {
        return timespan;
      }
    }
    return undefined;
  }

  private removeQueryParam(param: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    history.replaceState(history.state, '', url.href);
  }

  public generatePermalink = () => {
    let paramUrl = '';
    if (this.graphDatasetsSrvc.hasDatasets()) {
      const ids: string[] = [];
      this.graphDatasetsSrvc.datasets.forEach((ds) => {
        this.datasetStateServices?.forEach((dss) => {
          const permaId = dss.getPermaId(ds);
          if (permaId !== undefined) {
            ids.push(permaId);
          }
        });
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
