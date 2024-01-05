import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DatasetOptions, Time, TimeInterval, Timespan } from '@helgoland/core';

import { D3TimeseriesGraphComponent } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3PlotOptions } from '../model/d3-plot-options';

@Component({
  selector: 'n52-d3-overview-timeseries-graph',
  templateUrl: './d3-overview-timeseries-graph.component.html',
  styleUrls: ['./d3-overview-timeseries-graph.component.scss'],
  standalone: true,
  imports: [D3TimeseriesGraphComponent],
})
export class D3OverviewTimeseriesGraphComponent
  implements OnChanges, AfterViewInit, OnDestroy, OnInit
{
  @Input()
  public datasetIds: string[] = [];

  @Input()
  public datasetOptions: Map<string, DatasetOptions> = new Map();

  @Input()
  public presenterOptions: D3PlotOptions = {};

  @Input()
  public timeInterval: TimeInterval | undefined;

  @Input()
  public rangefactor: number = 1;

  @Input()
  public reloadForDatasets: string[] = [];

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onLoading: EventEmitter<boolean> = new EventEmitter();

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onContentLoading: EventEmitter<boolean> = new EventEmitter();

  public overviewTimespan: Timespan | undefined;
  public timespan: Timespan | undefined;

  private init = false;

  constructor(
    protected timeSrvc: Time,
    protected cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.presenterOptions.overview = true;
  }

  public ngAfterViewInit(): void {
    this.calculateOverviewRange();
    this.init = true;
    this.cd.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['timeInterval'] && this.init) {
      this.calculateOverviewRange();
    }
  }

  public ngOnDestroy(): void {
    this.cd.detach();
  }

  public timeSpanChanged(timespan: Timespan) {
    this.onTimespanChanged.emit(timespan);
  }

  public onGraphLoading(loading: boolean) {
    this.onContentLoading.emit(loading);
  }

  private calculateOverviewRange() {
    if (this.timeInterval) {
      const timespan = this.timeSrvc.createTimespanOfInterval(
        this.timeInterval,
      );
      this.timespan = timespan;
      this.overviewTimespan = this.timeSrvc.getBufferedTimespan(
        timespan,
        this.rangefactor,
      );
    }
  }
}
