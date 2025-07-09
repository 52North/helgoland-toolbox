import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  input,
  output,
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

  public readonly datasetIds = input.required<string[]>();

  public readonly datasetOptions = input<Map<string, DatasetOptions>>();

  public readonly presenterOptions = input<D3PlotOptions, D3PlotOptions>(
    {
      overview: true,
      yaxis: false,
    },
    {
      transform: (value: D3PlotOptions) => {
        debugger;
        return {
          ...value,
          overview: true,
          yaxis: false,
        };
      },
    },
  );

  public readonly timeInterval = input.required<TimeInterval>();

  public readonly rangefactor = input<number>(1);

  public readonly reloadForDatasets = input<string[]>([]);

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onTimespanChanged = output<Timespan>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onLoading = output<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onContentLoading = output<boolean>();

  public overviewTimespan: Timespan | undefined;
  public timespan!: Timespan;

  private init = false;

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
    const timespan = this.timeSrvc.createTimespanOfInterval(
      this.timeInterval(),
    );
    this.timespan = timespan;
    if (this.timespan) {
      this.overviewTimespan = this.timeSrvc.getBufferedTimespan(
        timespan,
        this.rangefactor(),
      );
    }
  }
}
