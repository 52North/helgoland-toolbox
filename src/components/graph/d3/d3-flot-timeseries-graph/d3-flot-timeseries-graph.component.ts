import  {
    AfterViewInit,
    Component,
    ElementRef,
    IterableDiffers,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import { Observable, Observer } from 'rxjs/Rx';

import { DatasetGraphComponent } from './../../dataset-graph.component';
import { Data } from './../../../../model/api/data';
import { DatasetOptions } from './../../../../model/internal/options';
import { PlotOptions } from './../../flot/model/plotOptions';
import { LocatedTimeValueEntry } from './../../../../model/api/data';
import { Dataset, IDataset, Timeseries } from './../../../../model/api/dataset';

import { Timespan } from './../../../../model/internal/timeInterval';
import { ApiInterface } from './../../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../../services/time/time.service';

interface DataEntry extends LocatedTimeValueEntry {
    dist: number;
    tick: number;
    x: number;
    y: number;
    xDiagCoord?: number;
    latlng: L.LatLng;
    [id: string]: any;
}

@Component({
    selector: 'n52-d3-flot-timeseries-graph',
    templateUrl: './d3-flot-timeseries-graph.component.html',
    styleUrls: ['./d3-flot-timeseries-graph.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class D3FlotTimeseriesGraphComponent
    extends DatasetGraphComponent<DatasetOptions, PlotOptions>
    implements AfterViewInit {

    @ViewChild('d3flot')
    public d3Elem: ElementRef;

    private rawSvg: any;
    private graph: any;
    private height: number;
    private width: number;
    private margin = {
        top: 10,
        right: 10,
        bottom: 40,
        left: 40
    };
    private maxLabelwidth = 0;
    private lineTs: d3.Line<DataEntry>

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

    constructor(
        protected iterableDiffers: IterableDiffers,
        protected api: ApiInterface,
        protected datasetIdResolver: InternalIdHandler,
        protected timeSrvc: Time
    ) {
        super(iterableDiffers, api, datasetIdResolver, timeSrvc);
    }

    public ngAfterViewInit(): void {
        // this.changeTime(xaxis.min, xaxis.max);
        var xaxmin = 1516869053101;
        var xaxmax = 1516969053101;
        this.changeTime(xaxmin, xaxmax);

        this.rawSvg = d3.select(this.d3Elem.nativeElement)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');

        this.graph = this.rawSvg
            .append('g')
            .attr('transform', 'translate(' + (this.margin.left + this.maxLabelwidth) + ',' + this.margin.top + ')');

        this.lineTs = d3.line<DataEntry>()
            .x(this.calcX)
            .y(this.calcY)
            .curve(d3.curveLinear);


        this.plotGraph();
    }

    protected addDataset(id: string, url: string): void {
        this.api.getSingleTimeseries(id, url).subscribe(
            (timeseries) => this.loadDataset(timeseries),
            (error) => {
                this.api.getDataset(id, url).subscribe(
                    (dataset) => this.loadDataset(dataset)
                );
            }
        );
    }
    protected removeDataset(internalId: string): void {
    }
    protected setSelectedId(internalId: string): void {
    }
    protected removeSelectedId(internalId: string): void {
    }
    protected graphOptionsChanged(options: PlotOptions): void {
    }
    protected datasetOptionsChanged(internalId: string, options: DatasetOptions, firstChange: boolean) {
    }
    protected timeIntervalChanges(): void {
    }
    protected onResize(): void {
        this.plotGraph();
    }
    private changeTime(from: number, to: number) {
        this.onTimespanChanged.emit(new Timespan(from, to));
        console.log(this.timespan);
    }

    private loadDataset(dataset: IDataset) {
        console.log(dataset);

        console.log(this.timespan);

        const datasetOptions = this.datasetOptions.get(dataset.internalId);

        // const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
        if (dataset instanceof Timeseries) {
            console.log("instanceof Timeseries");

            console.log(this.timespan);
            const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
            console.log(buffer);
            this.api.getTsData<[number, number]>(dataset.id, dataset.url, buffer,
                {
                    format: 'flot',
                    expanded: this.plotOptions.showReferenceValues === true,
                    generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
                }
            ).subscribe(
                (result) => this.prepareTsData(dataset, result).subscribe(() => {
                    this.plotGraph();
                }),
                (error) => this.onError(error),
                () => console.log("do sth")
            );
        }
        // if (dataset instanceof Dataset) {
        //     console.log("instanceof Dataset");
        //     this.api.getData<[number, number]>(dataset.id, dataset.url, buffer,
        //         {
        //             format: 'flot',
        //             expanded: this.plotOptions.showReferenceValues === true,
        //             generalize: this.plotOptions.generalizeAllways || datasetOptions.generalize
        //         }
        //     ).subscribe(
        //         (result) => this.prepareData(dataset, result).subscribe(() => this.plotGraph()),
        //         (error) => this.onError(error),
        //         () => this.onCompleteLoadingData(dataset)
        //         );
        // }

        this.plotGraph();
    }

    // private createDataEntry(
    //     internalId: string,
    //     entry: LocatedTimeValueEntry,
    //     previous: DataEntry,
    //     index: number
    // ): DataEntry {
    //     const s = new L.LatLng(entry.geometry.coordinates[1], entry.geometry.coordinates[0]);
    //     let dist: number;
    //     if (previous) {
    //         const e = new L.LatLng(previous.geometry.coordinates[1], previous.geometry.coordinates[0]);
    //         const newdist = s.distanceTo(e);
    //         dist = previous.dist + Math.round(newdist / 1000 * 100000) / 100000;
    //     } else {
    //         dist = 0;
    //     }
    //     return {
    //         tick: index,
    //         dist: Math.round(dist * 10) / 10,
    //         timestamp: entry.timestamp,
    //         value: entry.value,
    //         [internalId]: entry.value,
    //         x: entry.geometry.coordinates[0],
    //         y: entry.geometry.coordinates[1],
    //         latlng: s,
    //         geometry: entry.geometry
    //     };
    // }

    private prepareTsData(dataset: IDataset, data: Data<[number, number]>): Observable<boolean> {
        console.log("prepareTsData()");
        return Observable.create((observer: Observer<boolean>) => {
            
        });
    }
    
    private calcX = (d: DataEntry, i: number) => {
        return 1;
    }
    
    private calcY = (d: DataEntry) => {
        return 2;
    }
    
    private calculateHeight(): number {
        return this.rawSvg.node().clientHeight - this.margin.top - this.margin.bottom;
    }
    
    private calculateWidth(): number {
        return this.rawSvg.node().clientWidth - this.margin.left - this.margin.right - this.maxLabelwidth;
    }

    private plotGraph() {
        this.height = this.calculateHeight();
        this.width = this.calculateWidth();

        this.graph.selectAll('*').remove();

        // this.datasetMap.forEach((entry, id) => {
        //     if (this.datasetOptions.has(id) && this.datasetOptions.get(id).visible && entry.data) {
        //         this.drawGraph(entry.yScale, entry.drawOptions);
        //     }
        // });
        
    }

    private onError(error: any) {
        console.error(error);
    }

}
