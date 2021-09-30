import { Component, OnInit, ViewChild } from '@angular/core';
import {
    ColorService,
    DatasetType,
    DefinedTimespan,
    DefinedTimespanService,
    HelgolandServicesConnector,
    HelgolandTimeseries,
    Timespan,
} from '@helgoland/core';
import {
    AxisSettings,
    D3Copyright,
    D3SeriesGraphComponent,
    D3SeriesGraphOptions,
    GraphDataset,
    HoveringStyle,
} from '@helgoland/d3';

import { LineStyle } from './../../../../projects/helgoland/d3/src/lib/d3-series-graph/d3-series-graph.component';

@Component({
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

    public graphDatasets: GraphDataset[] = [];
    public timespan: Timespan = this.definedTsSrvc.getInterval(DefinedTimespan.TODAY);

    public copyright: D3Copyright = {
        label: '52north',
        positionX: 'right',
        positionY: 'bottom',
        link: 'http://52north.org'
    }

    public plotOptions: D3SeriesGraphOptions = {
        showTimeLabel: false,
        hoverStyle: HoveringStyle.point,
        timeRangeLabel: {
            show: true
        },
        yaxisModifier: true
    }

    @ViewChild(D3SeriesGraphComponent)
    private d3Graph!: D3SeriesGraphComponent;

    constructor(
        private servicesConnector: HelgolandServicesConnector,
        private definedTsSrvc: DefinedTimespanService,
        private colorSrvc: ColorService
    ) { }

    public ngOnInit(): void {

        // this.setNewTimespan();
        this.graphDatasets = [{
            id: 'temp',
            yaxis: new AxisSettings('random'),
            selected: false,
            visible: true,
            style: new LineStyle('red', 3, 3),
            data: [
                {
                    timestamp: new Date().getTime(),
                    value: this.createValue()
                }
            ]
        }];
        this.loadDataset();
    }

    public loadDataset() {
        const id = 'https://fluggs.wupperverband.de/sos2/api/v1/__26';
        this.servicesConnector.getDataset(id, { type: DatasetType.Timeseries }).subscribe(ds => {
            this.loadDatasetData(ds, id);
        });
    }

    public changePlotOptions() {
        this.plotOptions.showTimeLabel = !this.plotOptions.showTimeLabel;
        this.plotOptions.hoverStyle = this.getHoveringStyle(this.plotOptions.hoverStyle);
    }

    private getHoveringStyle(hs: HoveringStyle): HoveringStyle {
        switch (hs) {
            case HoveringStyle.line:
                return HoveringStyle.point;
            case HoveringStyle.point:
                return HoveringStyle.none;
            case HoveringStyle.none:
                return HoveringStyle.line;
        }
    }

    private loadDatasetData(ds: HelgolandTimeseries, id: string) {
        this.servicesConnector.getDatasetData(ds, this.timespan).subscribe(data => {
            const datasetData: GraphDataset = {
                id: id,
                yaxis: new AxisSettings(ds.uom),
                selected: false,
                visible: true,
                style: new LineStyle('green', 3, 3),
                data: data.values.map(e => {
                    return {
                        timestamp: e[0],
                        value: e[1]
                    };
                })
            };
            const idx = this.graphDatasets.findIndex(e => e.id === id);
            if (idx >= 0) {
                this.graphDatasets[idx] = datasetData;
            } else {
                this.graphDatasets.push(datasetData);
            }
        });
    }

    public addNewValue() {
        this.graphDatasets[0].data.push({
            timestamp: new Date().getTime(),
            value: this.createValue()
        });
        this.redrawGraph();
    }

    public zoomTimeframe() {
        const factor = 0.1;
        const diff = this.timespan.to - this.timespan.from;
        const d = diff * factor;
        this.timespan = new Timespan(this.timespan.from + d, this.timespan.to - d);
    }

    public changeStyle() {
        this.graphDatasets.forEach(e => {
            e.style.baseColor = this.colorSrvc.getColor();
        });
        this.redrawGraph();
    }

    public updateTimespan(timespan: Timespan) {
        this.timespan = timespan;
    }

    public redrawGraph() {
        this.d3Graph.redrawCompleteGraph();
    }

    public onDatasetSelected(temp: any) {
        console.log(temp);
    }

    private createValue(): number {
        return Math.floor(Math.random() * 10);
    }
}
