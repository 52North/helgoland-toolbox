import 'Flot/jquery.flot.js';
import 'Flot/jquery.flot.time.js';
import './jquery.flot.navigate.js';
import './jquery.flot.selection.js';
import './jquery.flot.touch.js';

import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    IterableDiffers,
    Output,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { LabelMapperService } from '../../../depiction/label-mapper/label-mapper.service';
import { DatasetGraphComponent } from '../../dataset-graph.component';
import { Data } from './../../../../model/api/data';
import { Dataset, IDataset, Timeseries } from './../../../../model/api/dataset';
import { DatasetOptions, ReferenceValueOption } from './../../../../model/internal/options';
import { Timespan } from './../../../../model/internal/timeInterval';
import { ApiInterface } from './../../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../../services/time/time.service';
import { DataSeries } from './../model/dataSeries';
import { Plot } from './../model/plot';
import { PlotOptions } from './../model/plotOptions';

declare var $: any;

@Component({
    selector: 'n52-flot-timeseries-graph',
    templateUrl: './flot-timeseries-graph.component.html',
    styleUrls: ['./flot-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlotTimeseriesGraphComponent
    extends DatasetGraphComponent<DatasetOptions, PlotOptions>
    implements AfterViewInit {

    @Output()
    public onHighlight: EventEmitter<string> = new EventEmitter();

    @ViewChild('flot')
    public flotElem: ElementRef;

    private plotarea: any;

    private preparedData: DataSeries[] = Array();

    private plotOptions: PlotOptions = {
        grid: {
            autoHighlight: true,
            hoverable: true
        },
        series: {
            lines: {
                fill: false,
                show: true
            },
            points: {
                fill: true,
                radius: 2,
                show: false
            },
            shadowSize: 1
        },
        selection: {
            mode: null
        },
        xaxis: {
            mode: 'time',
            timezone: 'browser',
        },
        yaxes: [],
        showReferenceValues: false
    };

    private datasetMap: Map<string, IDataset> = new Map();

    private lastHightlight: string;

    private loadingCounter: number = 0;

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time,
        private labelMapper: LabelMapperService
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    public ngAfterViewInit() {
        this.plotarea = this.flotElem.nativeElement;

        $(this.plotarea).bind('plotzoom', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            this.changeTime(xaxis.min, xaxis.max);
        });

        // plot pan ended event
        $(this.plotarea).bind('plotpanEnd', (evt: any, plot: any) => {
            const xaxis = plot.getXAxes()[0];
            this.changeTime(xaxis.min, xaxis.max);
        });

        $(this.plotarea).bind('touchended', (evt: any, plot: any) => {
            this.changeTime(plot.xaxis.from, plot.xaxis.to);
        });

        // plot selected event
        $(this.plotarea).bind('plotselected', (evt: any, ranges: any) => {
            this.changeTime(ranges.xaxis.from, ranges.xaxis.to);
        });

        $(this.plotarea).bind('plothover', (evt: any, pos: any, item: any) => {
            if (item) {
                this.onHighlight.emit(item.series.internalId);
                this.showTooltip(evt, pos, item);
            } else {
                this.onHighlight.emit('');
                this.hideTooltip();
            }
        });

        this.createTooltip();

        this.plotGraph();
    }

    protected graphOptionsChanged(options: PlotOptions) {
        Object.assign(this.plotOptions, options);
        this.plotOptions.yaxes = [];
        this.timeIntervalChanges();
    }

    protected setSelectedId(internalId: string) {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        tsData.selected = true;
        tsData.lines.lineWidth = 5;
        tsData.bars.lineWidth = 5;
        this.plotGraph();
    }

    protected removeSelectedId(internalId: string) {
        const tsData = this.preparedData.find((e) => e.internalId === internalId);
        tsData.selected = false;
        tsData.lines.lineWidth = 1;
        tsData.bars.lineWidth = 1;
        this.plotGraph();
    }

    protected timeIntervalChanges() {
        this.datasetMap.forEach((dataset) => {
            this.loadData(dataset);
        });
    }

    protected removeDataset(internalId: string) {
        this.datasetMap.delete(internalId);
        this.removePreparedData(internalId);
        this.plotGraph();
    }

    protected addDataset(internalId: string, url: string): void {
        this.api.getSingleTimeseries(internalId, url).subscribe(
            (timeseries) => this.addLoadedDataset(timeseries),
            (error) => {
                this.api.getDataset(internalId, url).subscribe(
                    (dataset) => this.addLoadedDataset(dataset)
                );
            }
        );
    }

    protected datasetOptionsChanged(internalId: string, options: DatasetOptions): void {
        if (this.datasetMap.has(internalId)) {
            this.loadData(this.datasetMap.get(internalId));
        }
    }

    protected onResize(): void {
        this.plotGraph();
    }

    private changeTime(from: number, to: number) {
        this.onTimespanChanged.emit(new Timespan(from, to));
    }

    private plotGraph() {
        if (this.preparedData && this.plotarea && this.preparedData.length !== 0 && this.plotOptions) {
            this.prepareAxisPos();
            this.plotOptions.xaxis.min = this.timespan.from;
            this.plotOptions.xaxis.max = this.timespan.to;
            const plotObj: Plot = $.plot(this.plotarea, this.preparedData, this.plotOptions);
            this.createPlotAnnotation(this.plotarea, this.plotOptions);
            this.createYAxis(plotObj);
            this.setSelection(plotObj, this.plotOptions);
        } else {
            if (this.plotarea) {
                $(this.plotarea).empty();
            }
        }
    }

    private removePreparedData(internalId: string) {
        // remove from preparedData Array
        const idx = this.preparedData.findIndex((entry) => entry.internalId === internalId);
        if (idx >= 0) { this.preparedData.splice(idx, 1); }
        // remove from axis
        const axisIdx = this.plotOptions.yaxes.findIndex((entry) => {
            const internalIdIndex = entry.internalIds.indexOf(internalId);
            if (internalIdIndex > -1) {
                if (entry.internalIds.length === 1) {
                    return true;
                } else {
                    entry.internalIds.splice(internalIdIndex, 1);
                    entry.tsColors.splice(internalIdIndex, 1);
                }
            }
            return false;
        });
        if (axisIdx > -1) {
            this.plotOptions.yaxes.splice(axisIdx, 1);
        }
    }

    private prepareData(dataset: IDataset, data: Data<[number, number]>): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            const dataIdx = this.preparedData.findIndex((e) => e.internalId === dataset.internalId);
            const styles = this.datasetOptions.get(dataset.internalId);
            this.createAxisLabel(dataset).subscribe((label) => {
                let axePos;
                const axe = this.plotOptions.yaxes.find((yaxisEntry, idx) => {
                    axePos = idx + 1;
                    return yaxisEntry.label === label;
                });
                if (axe) {
                    if (axe.internalIds.indexOf(dataset.internalId) < 0) {
                        axe.internalIds.push(dataset.internalId);
                        axe.tsColors.push(styles.color);
                    }
                    axe.min = styles.zeroBasedYAxe ? 0 : null;
                } else {
                    this.plotOptions.yaxes.push({
                        uom: dataset.uom,
                        label,
                        tsColors: [styles.color],
                        internalIds: [dataset.internalId],
                        min: styles.zeroBasedYAxe ? 0 : null
                    });
                    axePos = this.plotOptions.yaxes.length;
                }
                const dataEntry = {
                    internalId: dataset.internalId,
                    color: styles.color,
                    data: styles.visible ? data.values : [],
                    points: {
                        fillColor: styles.color
                    },
                    lines: {
                        lineWidth: 1
                    },
                    bars: {
                        lineWidth: 1
                    }
                };
                if (dataIdx >= 0) {
                    this.preparedData[dataIdx] = dataEntry;
                } else {
                    this.preparedData.push(dataEntry);
                }
                this.addReferenceValueData(dataset.internalId, styles, data);
                observer.next(true);
            });
        });
    }

    private addReferenceValueData(internalId: string, styles: DatasetOptions, data: Data<[number, number]>) {
        this.preparedData = this.preparedData.filter((entry) => {
            return !entry.internalId.startsWith('ref' + internalId);
        });
        if (this.plotOptions.showReferenceValues) {
            styles.showReferenceValues.forEach((refValue) => {
                const refDataEntry = {
                    internalId: 'ref' + internalId + refValue.id,
                    color: refValue.color,
                    data: data.referenceValues[refValue.id],
                    points: {
                        fillColor: refValue.color
                    },
                    lines: {
                        lineWidth: 1
                    },
                };
                this.preparedData.push(refDataEntry);
            });
        }
    }

    private prepareAxisPos() {
        // remove unused axes
        this.plotOptions.yaxes = this.plotOptions.yaxes.filter((entry) => entry.internalIds.length !== 0);
        this.plotOptions.yaxes.forEach((xaxis, idx) => {
            xaxis.internalIds.forEach((id) => {
                const temp = this.preparedData.find((dataEntry) => dataEntry.internalId === id);
                temp.yaxis = idx + 1;
            });
        });
    }

    private createAxisLabel(dataset: IDataset): Observable<string> {
        return this.labelMapper.getMappedLabel(dataset.parameters.phenomenon.label)
            .map((label) => label + ' [' + dataset.uom + ']');
    }

    private setSelection(plot: Plot, options: PlotOptions) {
        if (plot && options.selection.range) {
            plot.setSelection({
                xaxis: {
                    from: options.selection.range.from,
                    to: options.selection.range.to
                }
            }, true);
        }
    }

    private createPlotAnnotation(plotArea: any, options: PlotOptions) {
        if (options.annotation) {
            // plotArea.append('<div class="graph-annotation">Daten ohne Gewähr</div>');
        }
    }

    private createYAxis(plot: Plot) {
        if (plot.getOptions().yaxis.show) {
            // remove old labels
            $(plot.getPlaceholder()).find('.yaxisLabel').remove();

            // createYAxis
            $.each(plot.getAxes(), (i: number, axis: any) => {
                if (!axis.show) { return; }
                const box = axis.box;
                if (axis.direction === 'y') {
                    $('<div class="axisTargetStyle" style="position:absolute; left:'
                        + box.left + 'px; top:' + box.top + 'px; width:'
                        + box.width + 'px; height:' + box.height + 'px"></div>')
                        .data('axis.n', axis.n)
                        .appendTo(plot.getPlaceholder());
                    $('<div class="axisTarget" style="position:absolute; left:'
                        + box.left + 'px; top:' + box.top + 'px; width:'
                        + box.width + 'px; height:' + box.height + 'px"></div>')
                        .data('axis.n', axis.n)
                        .appendTo(plot.getPlaceholder())
                        .click((event: any) => {
                            const target = $(event.currentTarget);
                            let selected = false;
                            $.each($('.axisTarget'), (index: number, elem: any) => {
                                elem = $(elem);
                                if (target.data('axis.n') === elem.data('axis.n')) {
                                    selected = elem.hasClass('selected');
                                    return false; // break loop
                                }
                            });
                            const selections: string[] = [];
                            $.each(plot.getData(), (index: number, elem: any) => {
                                if (target.data('axis.n') === elem.yaxis.n) {
                                    elem.selected = !selected;
                                    if (elem.selected) {
                                        selections.push(elem.internalId);
                                    }
                                }
                            });
                            this.onDatasetSelected.emit(selections);
                            if (!selected) {
                                target.addClass('selected');
                            }
                            this.plotGraph();
                        });
                    if (!axis.options.hideLabel) {
                        const yaxisLabel = $('<div class="axisLabel yaxisLabel" style=left:'
                            + box.left + 'px;></div>').text(axis.options.label)
                            .appendTo(plot.getPlaceholder())
                            .data('axis.n', axis.n);
                        if (axis.options.tsColors) {
                            $.each(axis.options.tsColors, (idx: number, color: string) => {
                                $('<span>').html('&nbsp;&#x25CF;').css('color', color)
                                    .addClass('labelColorMarker').appendTo(yaxisLabel);
                            });
                        }
                        yaxisLabel.css('margin-left', -4 + (yaxisLabel.height() - yaxisLabel.width()) / 2);
                    }
                }
            });

            // set selection to axis
            plot.getData().forEach((elem: any) => {
                if (elem.selected) {
                    $('.flot-y' + elem.yaxis.n + '-axis').addClass('selected');
                    $.each($('.axisTarget'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                    $.each($('.axisTargetStyle'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                    $.each($('.axisLabel.yaxisLabel'), (i: number, entry: Element) => {
                        if ($(entry).data('axis.n') === elem.yaxis.n) {
                            if (!$(entry).hasClass('selected')) {
                                $(entry).addClass('selected');
                                return false;
                            }
                        }
                    });
                }
            });
        }
    }

    private addLoadedDataset(dataset: IDataset) {
        this.datasetMap.set(dataset.internalId, dataset);
        this.loadData(dataset);
    }

    private loadData(dataset: IDataset) {
        if (this.timespan && this.plotOptions) {
            if (this.loadingCounter === 0) { this.onLoading.emit(true); }
            this.loadingCounter++;
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            const datasetOptions = this.datasetOptions.get(dataset.internalId);
            if (dataset instanceof Timeseries) {
                this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                    {
                        format: 'flot',
                        expanded: this.plotOptions.showReferenceValues === true,
                        generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                    }
                ).subscribe(
                    (result) => this.prepareData(dataset, result).subscribe(() => {
                        this.plotGraph();
                    }),
                    (error) => this.onError(error),
                    () => this.onCompleteLoadingData(dataset)
                    );
            }
            if (dataset instanceof Dataset) {
                this.api.getData<[number, number]>(dataset.id, dataset.url, buffer,
                    {
                        format: 'flot',
                        expanded: this.plotOptions.showReferenceValues === true,
                        generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                    }
                ).subscribe(
                    (result) => this.prepareData(dataset, result).subscribe(() => this.plotGraph()),
                    (error) => this.onError(error),
                    () => this.onCompleteLoadingData(dataset)
                    );
            }
        }
    }

    private onError(error: any) {
        console.error(error);
    }

    private onCompleteLoadingData(dataset: IDataset) {
        this.loadingCounter--;
        if (this.loadingCounter === 0) { this.onLoading.emit(false); }
    }

    private createTooltip() {
        if ($('#tooltip').length === 0) {
            $('<div id="tooltip"></div>').appendTo('body');
        }
    }

    private showTooltip(event: any, pos: any, item: any) {
        $('#tooltip').empty();
        $('#tooltip').append('<div>' + item.datapoint[1].toFixed(2) + ' ' + item.series.yaxis.options.uom + '</div>');
        $('#tooltip').append('<div>' + item.series.xaxis.tickFormatter(item.datapoint[0], item.series.xaxis) + '</div>');
        const tooltip = $('#tooltip').show();
        const halfwidth = (event.target.clientWidth) / 2;
        if (halfwidth >= item.pageX - event.target.getBoundingClientRect().left) {
            tooltip.css({
                position: 'absolute',
                top: item.pageY + 5,
                left: item.pageX + 5,
                right: 'auto'
            });
        } else {
            tooltip.css({
                position: 'absolute',
                top: item.pageY + 5,
                right: ($(window).width() - item.pageX),
                left: 'auto'
            });
        }
    }

    private hideTooltip() {
        $('#tooltip').hide();
    }
}
