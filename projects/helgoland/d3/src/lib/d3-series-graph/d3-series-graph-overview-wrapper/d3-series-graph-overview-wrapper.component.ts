import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { DatasetOptions, Time, TimeInterval, Timespan } from '@helgoland/core';

import { D3SeriesGraphWrapperComponent } from '../d3-series-graph-wrapper/d3-series-graph-wrapper.component';
import { D3PlotOptions } from '../models/d3-plot-options';

@Component({
  selector: 'n52-d3-series-graph-overview-wrapper',
  templateUrl: './d3-series-graph-overview-wrapper.component.html',
  styleUrls: ['./d3-series-graph-overview-wrapper.component.scss'],
  imports: [D3SeriesGraphWrapperComponent],
})
export class D3SeriesGraphOverviewWrapperComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  protected timeSrvc = inject(Time);
  protected cd = inject(ChangeDetectorRef);

  @Input({ required: true })
  public datasetIds!: string[];

  @Input()
  public datasetOptions: Map<string, DatasetOptions> | undefined;

  @Input()
  public presenterOptions: D3PlotOptions | undefined;

  @Input({ required: true })
  public timeInterval!: TimeInterval;

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
  public timespan!: Timespan;

  private init = false;

  constructor() {
    if (this.presenterOptions) {
      this.presenterOptions.overview = true;
    } else {
      this.presenterOptions = {
        overview: true,
        yaxis: false,
      };
    }
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
    const timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
    this.timespan = timespan;
    if (this.timespan) {
      this.overviewTimespan = this.timeSrvc.getBufferedTimespan(
        timespan,
        this.rangefactor,
      );
    }
  }
}
