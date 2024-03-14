import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import {
  DefinedTimespan,
  DefinedTimespanService,
  Timespan,
} from '@helgoland/core';
import { PermalinkService } from '@helgoland/permalink';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import {
  DATASET_PERMALINK_SERVICE_INJECTION,
  DatasetPermalinkService,
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
export class DiagramViewPermalinkService extends PermalinkService<void> {
  constructor(
    private graphDatasetsSrvc: DatasetsService,
    private activatedRoute: ActivatedRoute,
    private definedTimeintervalSrvc: DefinedTimespanService,
    @Optional()
    @Inject(DATASET_PERMALINK_SERVICE_INJECTION)
    private permalinkServices: DatasetPermalinkService[] | undefined,
  ) {
    super();
    if (this.permalinkServices === null) {
      this.permalinkServices = [];
    }
  }

  public validatePeramlink(): Observable<void> {
    return this.activatedRoute.queryParams.pipe(
      mergeMap((params) => this.handleParams(params)),
      map((bla) => void 0),
    );
  }

  private handleParams(params: Params): Observable<boolean> {
    const valid: Observable<boolean>[] = [];
    if (params[PARAM_IDS]) {
      this.graphDatasetsSrvc.deleteAllDatasets();
      const ids = (params[PARAM_IDS] as string).split(ID_SEPERATOR);
      this.permalinkServices?.forEach((pls) => pls.validatePermaIds(ids));
    }
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
    return of(true);
    // if (valid.length) {
    //   return forkJoin(valid).pipe(map(() => true));
    // } else {
    //   return of(true);
    // };
  }

  protected generatePermalink(): string {
    let paramUrl = '';
    if (this.graphDatasetsSrvc.hasDatasets()) {
      const ids: string[] = [];
      this.permalinkServices?.forEach((pls) => {
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
  }
}
