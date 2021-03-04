import { Injectable, Optional } from '@angular/core';
import {
  BarRenderingHints,
  ColorService,
  DatasetOptions,
  HelgolandServicesConnector,
  LocalStorage,
  RenderingHintsDatasetService,
  Time,
  Timespan,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

const TIMESERIES_OPTIONS_CACHE_PARAM = 'timeseriesOptions';
const TIMESERIES_IDS_CACHE_PARAM = 'timeseriesIds';
const TIME_CACHE_PARAM = 'timeseriesTime';

@Injectable({
  providedIn: 'root'
})
export class TimeseriesService extends RenderingHintsDatasetService<DatasetOptions>{

  private _timespan: Timespan;

  constructor(
    protected serviceConnector: HelgolandServicesConnector,
    protected localStorage: LocalStorage,
    protected timeSrvc: Time,
    @Optional() protected translateSrvc?: TranslateService
  ) {
    super(serviceConnector, translateSrvc);
    this.initTimespan();
    this.loadState();
  }

  public get timespan(): Timespan {
    return this._timespan;
  }

  public set timespan(v: Timespan) {
    this._timespan = v;
    this.timeSrvc.saveTimespan(TIME_CACHE_PARAM, this._timespan);
  }

  protected createStyles(internalId: string): DatasetOptions {
    const options = new DatasetOptions(internalId, new ColorService().getColor());
    options.generalize = false;
    options.lineWidth = 2;
    options.pointRadius = 2;
    return options;
  }

  protected handleBarRenderingHints(barHints: BarRenderingHints, options: DatasetOptions) {
    super.handleBarRenderingHints(barHints, options);
    options.yAxisRange = { min: 0 };
  }

  protected saveState(): void {
    this.localStorage.save(TIMESERIES_IDS_CACHE_PARAM, this.datasetIds);
    this.localStorage.save(TIMESERIES_OPTIONS_CACHE_PARAM, Array.from(this.datasetOptions.values()));
  }

  protected loadState(): void {
    const options = this.localStorage.loadArray<DatasetOptions>(TIMESERIES_OPTIONS_CACHE_PARAM);
    if (options) { options.forEach(e => this.datasetOptions.set(e.internalId, e)); }
    this.datasetIds = this.localStorage.loadArray<string>(TIMESERIES_IDS_CACHE_PARAM) || [];
  }

  private initTimespan() {
    if (!this._timespan) {
      this._timespan =
        this.timeSrvc.loadTimespan(TIME_CACHE_PARAM) ||
        this.timeSrvc.createByDurationWithEnd(moment.duration(1, 'days'), new Date(), 'day');
    }
  }

}
