import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ColorService,
  DatasetOptions,
  DatasetType,
  HelgolandServicesConnector,
  InternalIdHandler,
  Timespan,
} from '@helgoland/core';
import {
  D3AxisType,
  D3GraphOptions,
  D3SelectionRange,
  HelgolandD3Module,
} from '@helgoland/d3';
import { HelgolandDatasetlistModule } from '@helgoland/depiction';
import { HelgolandMapViewModule } from '@helgoland/map';
import { GeoJsonObject, LineString, Point } from 'geojson';

import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

@Component({
  templateUrl: './trajectory.component.html',
  styleUrls: ['./trajectory.component.scss'],
  imports: [
    HelgolandDatasetlistModule,
    HelgolandD3Module,
    HelgolandMapViewModule,
    MatDialogModule,
  ],
})
export class TrajectoryComponent implements OnInit {
  private color = inject(ColorService);
  private dialog = inject(MatDialog);
  private internalIdHandler = inject(InternalIdHandler);
  private servicesConnector = inject(HelgolandServicesConnector);

  geometry!: LineString;

  highlightGeometry!: GeoJsonObject;

  datasetIds: string[] = [
    'http://nexos.demo.52north.org/52n-sos-nexos-test/api/__quantity_1',
    // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125100',
    // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125101',
    // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125102',
    // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125103',
    // 'http://codm.hzg.de/52n-sos-webapp/api/v1/__measurement_125104'
  ];

  options: Map<string, DatasetOptions> = new Map();

  timespan!: Timespan;

  selection!: D3SelectionRange;

  zoomToGeometry!: GeoJsonObject;

  graphOptions: D3GraphOptions = {
    axisType: D3AxisType.Distance,
    dotted: true,
  };

  ngOnInit(): void {
    this.datasetIds.forEach((entry) => {
      const option = new DatasetOptions(entry, this.color.getColor());
      option.visible = true;
      this.options.set(entry, option);
    });

    if (this.datasetIds.length > 0) {
      const internalId = this.internalIdHandler.resolveInternalId(
        this.datasetIds[0],
      );
      this.servicesConnector
        .getDataset(
          { id: internalId.id, url: internalId.url },
          { type: DatasetType.Trajectory },
        )
        .subscribe((dataset) => {
          this.timespan = new Timespan(
            dataset.firstValue!.timestamp,
            dataset.lastValue!.timestamp,
          );
          this.servicesConnector
            .getDatasetData(dataset, this.timespan)
            .subscribe((data) => {
              this.geometry = {
                type: 'LineString',
                coordinates: [],
              };
              data.values.forEach((entry) =>
                this.geometry.coordinates.push(entry.geometry.coordinates),
              );
            });
        });
    }
  }

  onChartHighlightChanged(idx: number) {
    this.highlightGeometry = {
      type: 'Point',
      coordinates: this.geometry.coordinates[idx],
    } as Point;
  }

  onChartSelectionChangedFinished(range: D3SelectionRange) {
    this.selection = range;
    this.zoomToGeometry = {
      type: 'LineString',
      coordinates: this.geometry.coordinates.slice(range.from, range.to),
    } as LineString;
  }

  onChartSelectionChanged(range: D3SelectionRange) {
    this.highlightGeometry = {
      type: 'LineString',
      coordinates: this.geometry.coordinates.slice(range.from, range.to),
    } as LineString;
  }

  editOptions(option: DatasetOptions) {
    const dialogRef = this.dialog.open(StyleModificationComponent, {
      data: option,
    });
  }
}
