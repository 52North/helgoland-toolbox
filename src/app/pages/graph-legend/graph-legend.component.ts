import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
    ColorService,
    DatasetOptions,
    DefinedTimespanService,
    HelgolandTimeseries,
    HelgolandTimeseriesData,
    InternalIdHandler,
    Time,
    TimeseriesData,
    Timespan,
    TimezoneService,
} from '@helgoland/core';
import {
    D3GeneralDataPoint,
    D3GeneralInput,
    D3PlotOptions,
    D3PointSymbolDrawerService,
    D3SimpleHoveringService,
    DataEntry,
    HelgolandD3Module,
    HighlightOutput,
    HoveringStyle,
    InternalDataEntry,
} from '@helgoland/d3';
import { HelgolandDatasetDownloadModule, HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandTimeModule } from '@helgoland/time';
import moment from 'moment';

import { D3GeneralPopupComponent } from '../../components/d3-general-popup/d3-general-popup.component';
import { ExportPopupComponent } from '../../components/export-popup/export-popup.component';
import { GeometryViewComponent } from '../../components/geometry-view/geometry-view.component';
import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

class HoveringTestService extends D3SimpleHoveringService {

    protected override setHoveringLabel(textContainer: d3.Selection<SVGGElement, any, any, any>, d: DataEntry, entry: InternalDataEntry, timeseries: HelgolandTimeseries) {
        const stringedValue = (typeof d.value === 'number') ? parseFloat(d.value.toPrecision(15)).toString() : d.value;
        const timelabel = this.timezoneSrvc.createTzDate(d.timestamp).format('L LT z');
        textContainer.append('text')
            .text(`${stringedValue} ${entry.axisOptions.uom} ${timelabel}`)
            .attr('class', 'mouseHoverDotLabel')
            .attr('alignment-baseline', 'text-before-edge')
            .style('pointer-events', 'none')
            .style('fill', 'black');
        textContainer.append('text').attr('dy', '1em').attr('alignment-baseline', 'text-before-edge').text(timeseries.parameters.phenomenon.label);
        textContainer.append('text').attr('dy', '2em').attr('alignment-baseline', 'text-before-edge').text(timeseries.parameters.category.label);
    }

}

@Component({
    templateUrl: './graph-legend.component.html',
    styleUrls: ['./graph-legend.component.scss'],
    imports: [
        HelgolandD3Module,
        HelgolandModificationModule,
        HelgolandTimeModule,
        HelgolandDatasetlistModule,
        HelgolandDatasetDownloadModule,
        MatDialogModule,
        CommonModule
    ],
    standalone: true
})
export class GraphLegendComponent {

    public datasetIds = [
        'https://fluggs.wupperverband.de/sws5/api/__26',
        'https://fluggs.wupperverband.de/sws5/api/__49',
        'https://fluggs.wupperverband.de/sws5/api/__51',
        'https://fluggs.wupperverband.de/sws5/api/__72',
        // 'http://nexos.demo.52north.org:80/52n-sos-nexos-test/api/__100',
        // 'http://nexos.dev.52north.org/52n-sos-upc/api/__46',
        // 'http://nexos.dev.52north.org/52n-sos-upc/api/__47',
        // 'http://nexos.dev.52north.org/52n-sos-upc/api/__48',
        // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__95',
        // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__96',
        // 'https://geo.irceline.be/sos/api/v1/__6941',
        // 'http://sensorweb.demo.52north.org/sensorwebtestbed/api/v1/__97',
        // 'http://nexos.dev.52north.org/52n-sos-upc/api/timeseries/46',
        // 'http://mudak-wrm.dev.52north.org/sos/api/__70'
    ];
    public reloadForDatasets: string[] = [];
    public timespan;
    public plotLanguage;
    public yaxisModifier = true;

    public hoveringService = new HoveringTestService(this.timezoneSrvc, this.pointSymbolDrawer);

    public loadings: Set<string> = new Set();

    public d3diagramOptions: D3PlotOptions = {
        showReferenceValues: true,
        togglePanZoom: true,
        generalizeAllways: false,
        yaxis: true,
        hoverStyle: HoveringStyle.point,
        copyright: {
            label: 'This should be bottom right and the text is long.',
            link: 'https://52north.org/',
            positionX: 'right',
            positionY: 'bottom'
        },
        showTimeLabel: false,
        timeRangeLabel: {
            show: true
        },
        groupYaxis: true
    };

    public d3overviewOptions: D3PlotOptions = {
        overview: true,
    };

    public datasetOptions: Map<string, DatasetOptions> = new Map();
    public datasetOptionsOne: Map<string, DatasetOptions> = new Map();

    public highlightId: string | undefined;

    public selectedIds: string[] = [];

    public overviewLoading = false
    public graphLoading = false;

    public hoverstyle: HoveringStyle = HoveringStyle.point;
    public HoveringStyleEnum = HoveringStyle;
    public highlightedTime: Date | undefined;

    // parameters to auto update timespan on click
    public timeIntervalUpdateTimespan = 100000; // milliseconds of time
    public refreshIntervalUpdateTimespan = 2; // seconds to refresh again

    constructor(
        private color: ColorService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private time: Time,
        private definedTime: DefinedTimespanService,
        public internalIdHandler: InternalIdHandler,
        private http: HttpClient,
        protected timezoneSrvc: TimezoneService,
        protected pointSymbolDrawer: D3PointSymbolDrawerService
    ) {
        this.datasetIds.forEach((entry) => {
            const option = new DatasetOptions(entry, this.color.getColor());
            option.generalize = true;
            option.lineWidth = 2;
            option.pointRadius = 4;
            this.datasetOptions.set(entry, option);
        });

        this.timespan = this.time.createByDurationWithEnd(moment.duration(5, "days"), new Date().getTime() - 1000 * 60 * 60 * 24 * 1, 'day');
    }

    public timespanChanged(timespan: Timespan) {
        this.timespan = timespan;
    }

    public isSelected(id: string) {
        return this.selectedIds.indexOf(id) > -1;
    }

    public showGeometry(geometry: GeoJSON.GeoJsonObject) {
        this.dialog.open(GeometryViewComponent, {
            data: geometry
        });
    }

    public refreshData() {
        this.reloadForDatasets = [this.datasetIds[0]];
    }

    public highlight(selected: boolean, id: string) {
        this.highlightId = id;
    }

    public setSelected(selectedIds: string[]) {
        this.selectedIds = selectedIds;
    }

    public deleteTimeseries(id: string) {
        const idx = this.datasetIds.findIndex((entry) => entry === id);
        this.datasetIds.splice(idx, 1);
        this.datasetOptions.delete(id);
    }

    public changeYAxesVisibility() {
        this.d3diagramOptions.yaxis = !this.d3diagramOptions.yaxis;
    }

    public updateOptions(option: DatasetOptions) {
        this.datasetOptions.set(option.internalId, option);
    }

    public onGraphLoading(loading: boolean) {
        this.graphLoading = loading;
    }

    public listLoadings() {
        return Array.from(this.loadings);
    }

    public onOverviewLoading(loading: boolean) {
        this.overviewLoading = loading;
        this.cdr.detectChanges();
    }

    public editOption(option: DatasetOptions) {
        this.dialog.open(StyleModificationComponent, {
            data: option
        });
    }

    public dateChanged(date: Date) {
        this.timespan = this.time.centerTimespan(this.timespan, date);
    }

    public selectTimeseries(selected: boolean, id: string) {
        if (selected) {
            if (this.selectedIds.indexOf(id) < 0) {
                this.selectedIds.push(id);
            }
        } else {
            if (this.selectedIds.indexOf(id) >= 0) {
                this.selectedIds.splice(this.selectedIds.findIndex((entry) => entry === id), 1);
            }
        }
    }

    // public refresh(triggered) {
    //     console.log('refresh at ' + new Date());
    // }

    public groupYaxisChanged() {
        this.d3diagramOptions.groupYaxis = !this.d3diagramOptions.groupYaxis;
    }

    public changeHovering(id: HoveringStyle) {
        this.hoverstyle = id;
        this.d3diagramOptions.hoverStyle = this.hoverstyle;
    }

    public highlightChanged(highlightObject: HighlightOutput) {
        this.highlightedTime = new Date(highlightObject.timestamp);
    }

    /**
     * Function that is executed as soons as a hovered datapoint is clicked.
     * @param tsData {TimeseriesData[]} array of various timeseries with data at the same timestamp
     */
    public clickedDataPoint(tsData: {
        timeseries: HelgolandTimeseries;
        data: HelgolandTimeseriesData;
    }) {
        console.log(tsData);
        // const datasets: D3GeneralDatasetInput[] = [];
        // tsData.forEach(ts => {
        //     const values: D3GeneralDataPoint[] = ts.data.map((val) => {
        //         return { x: val.timestamp, y: val.value, date: (new Date(val.timestamp)).toUTCString() };
        //     });
        //     const singleTs: D3GeneralDatasetInput = {
        //         data: values,
        //         id: ts.id
        //     };

        //     datasets.push(singleTs);
        // });
        // const popupInput: D3GeneralInput = {
        //     datasets: datasets,
        //     plotOptions: {
        //         // TODO: change to x and y axis label + make date boolean dynamic
        //         xlabel: 'Time',
        //         ylabel: 'DataPoint',
        //         date: true
        //     }
        // };

        // this.dialog.open(D3GeneralPopupComponent, {
        //     data: popupInput
        // });
    }

    public showPopup() {
        this.http.get('../assets/dataset/sampledataset.csv', { responseType: 'text' })
            .subscribe(
                data => {
                    const dataSplit = data.split(/\r\n|\n|\r|,/);
                    const dataset: D3GeneralInput = {
                        datasets: [],
                        plotOptions: {
                            xlabel: dataSplit[0],
                            ylabel: dataSplit[1],
                            date: false
                        }
                    };
                    const dataPoints: D3GeneralDataPoint[] = [];
                    for (let i = 2; i < dataSplit.length; i += 2) {
                        dataPoints.push({ x: Number(dataSplit[i]), y: Number(dataSplit[i + 1]) });
                    }
                    dataset.datasets.push(
                        {
                            data: dataPoints,
                            id: 'csv file'
                        });
                    this.dialog.open(D3GeneralPopupComponent, {
                        data: dataset
                    });
                },
                error => {
                    console.log(error);
                }
            );
    }

    public openDownload(id: String) {
        this.dialog.open(ExportPopupComponent, {
            data: {
                id,
                timespan: this.timespan
            }
        });
    }

}
