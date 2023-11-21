import { Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DefinedTimespan, DefinedTimespanService, Timespan } from '@helgoland/core';
import { PermalinkService } from '@helgoland/permalink';
import { forkJoin, from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { TimeseriesService } from './../../services/timeseries-service.service';

const PARAM_IDS = 'ids';
const ID_SEPERATOR = '!!';
const PARAM_TIME = 'time';
const TIME_SEPERATOR = '|';
const PARAM_DEFINED_TIME = 'defined_time';

@Injectable({
  providedIn: 'root'
})
export class DiagramViewPermalinkService extends PermalinkService<void> {

  constructor(
    private timeseriesSrvc: TimeseriesService,
    private activatedRoute: ActivatedRoute,
    private definedTimeintervalSrvc: DefinedTimespanService
  ) {
    super();
  }

  public validatePeramlink(): Observable<void> {
    return this.activatedRoute.queryParams.pipe(
      mergeMap(params => this.handleParams(params)),
      map(bla => void 0)
    );
  }

  private handleParams(params: Params): Observable<boolean> {
    const valid: Observable<boolean>[] = [];
    if (params[PARAM_IDS]) {
      this.timeseriesSrvc.removeAllDatasets(true);
      const ids = (params[PARAM_IDS] as string).split(ID_SEPERATOR);
      valid.push(...ids.map((id) => from(this.timeseriesSrvc.addDataset(id))));
    }
    if (params[PARAM_TIME]) {
      const time = (params[PARAM_TIME] as string).split(TIME_SEPERATOR);
      if (time.length === 2) {
        const start = parseInt(time[0], 10);
        const end = parseInt(time[1], 10);
        this.timeseriesSrvc.timespan = new Timespan(start, end);
      }
    } else if (params[PARAM_DEFINED_TIME]) {
      const definedTime = params[PARAM_DEFINED_TIME] as DefinedTimespan;
      const timespan = this.definedTimeintervalSrvc.getInterval(definedTime);
      if (timespan) { this.timeseriesSrvc.timespan = timespan; }
    }
    if (valid.length) {
      return forkJoin(valid).pipe(map(() => true));
    } else {
      return of(true);
    };
  }

  protected generatePermalink(): string {
    let paramUrl = '';
    if (this.timeseriesSrvc.hasDatasets()) {
      const id = this.timeseriesSrvc.datasetIds.join(ID_SEPERATOR);
      paramUrl = this.createBaseUrl() + '?' + PARAM_IDS + '=' + encodeURIComponent(id);
      if (this.timeseriesSrvc.timespan) {
        paramUrl = paramUrl + '&' + PARAM_TIME + '=' + encodeURIComponent(this.timeseriesSrvc.timespan.from
          + TIME_SEPERATOR + this.timeseriesSrvc.timespan.to);
      }
    }
    return paramUrl;
  }

}
