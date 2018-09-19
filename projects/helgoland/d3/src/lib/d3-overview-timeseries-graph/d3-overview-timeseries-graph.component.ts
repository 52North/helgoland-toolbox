import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { DatasetOptions, HasLoadableContent, Mixin, Time, TimeInterval, Timespan } from '@helgoland/core';

import { D3PlotOptions } from '../model/d3-plot-options';

@Component({
    selector: 'n52-d3-overview-timeseries-graph',
    templateUrl: './d3-overview-timeseries-graph.component.html',
    styleUrls: ['./d3-overview-timeseries-graph.component.scss']
})
@Mixin([HasLoadableContent])
export class D3OverviewTimeseriesGraphComponent implements OnChanges, AfterViewInit, HasLoadableContent {

    @Input()
    public datasetIds: string[];

    @Input()
    public datasetOptions: Map<string, DatasetOptions>;

    @Input()
    public presenterOptions: D3PlotOptions;

    @Input()
    public timeInterval: TimeInterval;

    @Input()
    public rangefactor: number;

    @Input()
    public reloadForDatasets: string[];

    @Output()
    public onTimespanChanged: EventEmitter<Timespan> = new EventEmitter();

    @Output()
    public onLoading: EventEmitter<boolean> = new EventEmitter();

    @Output()
    public onContentLoading: EventEmitter<boolean> = new EventEmitter();

    public isContentLoading: (loading: boolean) => void;

    public overviewTimespan: Timespan;
    public timespan: Timespan;

    private init = false;

    constructor(
        protected timeSrvc: Time,
        protected cd: ChangeDetectorRef
    ) {
        if (this.presenterOptions) {
            this.presenterOptions.overview = true;
        } else {
            this.presenterOptions = { overview: true };
        }
    }

    public ngAfterViewInit(): void {
        this.rangefactor = this.rangefactor || 1;
        this.calculateOverviewRange();
        this.init = true;
        this.cd.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.timeInterval && this.init) {
            this.calculateOverviewRange();
        }
    }

    public timeSpanChanged(timespan: Timespan) {
        this.onTimespanChanged.emit(timespan);
    }

    public onGraphLoading(loading: boolean) {
        this.isContentLoading(loading);
    }

    private calculateOverviewRange() {
        const timespan = this.timeSrvc.createTimespanOfInterval(this.timeInterval);
        this.timespan = timespan;
        this.overviewTimespan = this.timeSrvc.getBufferedTimespan(timespan, this.rangefactor);
    }
}
