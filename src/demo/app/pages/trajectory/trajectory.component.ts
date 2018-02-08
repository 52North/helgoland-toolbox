import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import {
    ApiInterface,
    ColorService,
    DatasetOptions,
    InternalIdHandler,
    LocatedTimeValueEntry,
    Timespan,
} from '@helgoland/core';
import { D3AxisType, D3GraphOptions, D3SelectionRange } from '@helgoland/d3';
import { GeoJsonObject, LineString, Point } from 'geojson';
import { selector } from 'rxjs/operator/publish';
import { Map } from 'rxjs/util/Map';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
    selector: 'trajectory',
    templateUrl: './trajectory.component.html',
    styleUrls: ['./trajectory.component.scss']
})
export class TrajectoryComponent implements OnInit {

    public geometry: LineString;

    public highlightGeometry: GeoJsonObject;

    public datasetIds: string[] = [
        'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125100',
        'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125101',
        'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125102',
        'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125103',
        'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125104'
    ];

    public options: Map<string, DatasetOptions> = new Map();

    public timespan: Timespan;

    public selection: D3SelectionRange;

    public zoomToGeometry: GeoJsonObject;

    public graphOptions: D3GraphOptions = {
        axisType: D3AxisType.Distance,
        dotted: false
    };

    constructor(
        private color: ColorService,
        private dialog: MatDialog,
        private internalIdHandler: InternalIdHandler,
        private api: ApiInterface
    ) { }

    public ngOnInit(): void {

        this.datasetIds.forEach((entry) => {
            const option = new DatasetOptions(entry, this.color.getColor());
            option.visible = false;
            this.options.set(entry, option);
        });

        if (this.datasetIds.length > 0) {
            const internalId = this.internalIdHandler.resolveInternalId(this.datasetIds[0]);
            this.api.getDataset(internalId.id, internalId.url).subscribe((dataset) => {
                this.timespan = new Timespan(dataset.firstValue.timestamp, dataset.lastValue.timestamp);
                this.api.getData<LocatedTimeValueEntry>(internalId.id, internalId.url, this.timespan)
                    .subscribe((data) => {
                        this.geometry = {
                            type: 'LineString',
                            coordinates: []
                        };
                        data.values.forEach((entry) => this.geometry.coordinates.push(entry.geometry.coordinates));
                    });
            });
        }
    }

    public onChartHighlightChanged(idx: number) {
        this.highlightGeometry = {
            type: 'Point',
            coordinates: this.geometry.coordinates[idx]
        } as Point;
    }

    public onChartSelectionChangedFinished(range: D3SelectionRange) {
        this.selection = range;
        this.zoomToGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        } as LineString;
    }

    public onChartSelectionChanged(range: D3SelectionRange) {
        this.highlightGeometry = {
            type: 'LineString',
            coordinates: this.geometry.coordinates.slice(range.from, range.to)
        } as LineString;
    }

    public editOptions(option: DatasetOptions) {
        const dialogRef = this.dialog.open(StyleModificationComponent, {
            data: option
        });
    }

}
