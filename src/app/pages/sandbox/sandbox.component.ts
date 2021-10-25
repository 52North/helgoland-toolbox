import { Component, OnInit } from '@angular/core';
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
    D3SeriesGraphOptions,
    DatasetDescription,
    DatasetEntry,
    HoveringStyle,
    LineStyle,
} from '@helgoland/d3';

@Component({
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

    public datasets: DatasetEntry[] = [];
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

    constructor(
        private servicesConnector: HelgolandServicesConnector,
        private definedTsSrvc: DefinedTimespanService,
        private colorSrvc: ColorService
    ) { }

    public ngOnInit(): void {
        // this.setNewTimespan();
        const value = {
            timestamp: new Date().getTime(),
            value: this.createValue()
        }
        const style = new LineStyle('red', 3, 3);
        const yaxis = new AxisSettings();
        const description: DatasetDescription = {
            categoryLabel: 'category',
            firstValue: value,
            lastValue: value,
            phenomenonLabel: 'phenomenon',
            platformLabel: 'platform',
            procedureLabel: 'procedure',
            uom: 'random'
        }

        this.datasets = [new DatasetEntry('temp', style, yaxis, true, false, description)]
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
            const style = new LineStyle('green', 3, 3);
            const yaxis = new AxisSettings();
            const description: DatasetDescription = {
                categoryLabel: ds.parameters.category.label,
                firstValue: ds.firstValue,
                lastValue: ds.lastValue,
                phenomenonLabel: ds.parameters.phenomenon.label,
                platformLabel: ds.platform.label,
                procedureLabel: ds.parameters.procedure.label,
                uom: ds.uom
            }
            const datasetData = new DatasetEntry(id, style, yaxis, true, false, description);
            datasetData.setData(data.values.map(e => {
                return {
                    timestamp: e[0],
                    value: e[1]
                };
            }));
            const idx = this.datasets.findIndex(e => e.id === id);
            if (idx >= 0) {
                this.datasets[idx] = datasetData;
            } else {
                this.datasets.push(datasetData);
            }
        });
    }

    public addNewValue() {
        this.datasets[0].addNewData(
            {
                timestamp: new Date().getTime(),
                value: this.createValue()
            }
        )
    }

    public zoomTimeframe() {
        const factor = 0.1;
        const diff = this.timespan.to - this.timespan.from;
        const d = diff * factor;
        this.timespan = new Timespan(this.timespan.from + d, this.timespan.to - d);
    }

    public changeStyle() {
        this.datasets.forEach(e => {
            const style = e.getStyle();
            style.baseColor = this.colorSrvc.getColor();
            e.setStyle(style);
        });
    }

    public updateTimespan(timespan: Timespan) {
        this.timespan = timespan;
    }

    public onDatasetSelected(temp: any) {
        console.log(temp);
    }

    private createValue(): number {
        return Math.floor(Math.random() * 10);
    }
}
