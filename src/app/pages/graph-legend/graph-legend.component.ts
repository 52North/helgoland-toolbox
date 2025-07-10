import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  D3PlotOptions,
  D3PointSymbolDrawerService,
  D3SimpleHoveringService,
  DataEntry,
  HelgolandD3Module,
  HighlightOutput,
  HoveringStyle,
  SeriesGraphDataset,
} from '@helgoland/d3';
import {
  HelgolandDatasetDownloadModule,
  HelgolandDatasetlistModule,
} from '@helgoland/depiction';
import { HelgolandModificationModule } from '@helgoland/modification';
import { HelgolandTimeModule } from '@helgoland/time';
import moment from 'moment';

import { ExportPopupComponent } from '../../components/export-popup/export-popup.component';
import { GeometryViewComponent } from '../../components/geometry-view/geometry-view.component';
import { StyleModificationComponent } from '../../components/style-modification/style-modification.component';

class HoveringTestService extends D3SimpleHoveringService {
  protected override setHoveringLabel(
    textContainer: d3.Selection<SVGGElement, any, any, any>,
    d: DataEntry,
    dataset: SeriesGraphDataset,
  ) {
    const stringedValue =
      typeof d.value === 'number'
        ? parseFloat(d.value.toPrecision(15)).toString()
        : d.value;
    const timelabel = this.timezoneSrvc
      .createTzDate(d.timestamp)
      .format('L LT z');
    textContainer
      .append('text')
      .text(`${stringedValue} ${dataset.description.uom} ${timelabel}`)
      .attr('class', 'mouseHoverDotLabel')
      .attr('alignment-baseline', 'text-before-edge')
      .style('pointer-events', 'none')
      .style('fill', 'black');
    if (dataset.description.phenomenonLabel) {
      textContainer
        .append('text')
        .attr('dy', '1em')
        .attr('alignment-baseline', 'text-before-edge')
        .text(dataset.description.phenomenonLabel);
    }
    if (dataset.description.categoryLabel) {
      textContainer
        .append('text')
        .attr('dy', '2em')
        .attr('alignment-baseline', 'text-before-edge')
        .text(dataset.description.categoryLabel.join(', '));
    }
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
  ],
})
export class GraphLegendComponent {
  private color = inject(ColorService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);
  private time = inject(Time);
  private definedTime = inject(DefinedTimespanService);
  internalIdHandler = inject(InternalIdHandler);
  private http = inject(HttpClient);
  protected timezoneSrvc = inject(TimezoneService);
  protected pointSymbolDrawer = inject(D3PointSymbolDrawerService);

  datasetIds = [
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
  reloadForDatasets: string[] = [];
  timespan;
  yaxisModifier = true;

  hoveringService = new HoveringTestService();

  loadings: Set<string> = new Set();

  d3diagramOptions: D3PlotOptions = {
    showReferenceValues: true,
    togglePanZoom: true,
    generalizeAllways: false,
    yaxis: true,
    hoverStyle: HoveringStyle.point,
    copyright: {
      label: 'This should be bottom right and the text is long.',
      link: 'https://52north.org/',
      positionX: 'right',
      positionY: 'bottom',
    },
    showTimeLabel: false,
    timeRangeLabel: {
      show: true,
    },
    groupYaxis: true,
  };

  d3overviewOptions: D3PlotOptions = {
    overview: true,
    hoverStyle: HoveringStyle.none,
    yaxis: false,
  };

  datasetOptions: Map<string, DatasetOptions> = new Map();
  datasetOptionsOne: Map<string, DatasetOptions> = new Map();

  highlightId: string | undefined;

  selectedIds: string[] = [];

  overviewLoading = false;
  graphLoading = false;

  hoverstyle: HoveringStyle = HoveringStyle.point;
  HoveringStyleEnum = HoveringStyle;
  highlightedTime: Date | undefined;

  // parameters to auto update timespan on click
  timeIntervalUpdateTimespan = 100000; // milliseconds of time
  refreshIntervalUpdateTimespan = 2; // seconds to refresh again

  constructor() {
    this.datasetIds.forEach((entry) => {
      const option = new DatasetOptions(entry, this.color.getColor());
      option.generalize = true;
      option.lineWidth = 2;
      option.pointRadius = 4;
      this.datasetOptions.set(entry, option);
    });

    this.timespan = this.time.createByDurationWithEnd(
      moment.duration(5, 'days'),
      new Date().getTime() - 1000 * 60 * 60 * 24 * 1,
      'day',
    );
  }

  timespanChanged(timespan: Timespan) {
    this.timespan = timespan;
  }

  isSelected(id: string) {
    return this.selectedIds.indexOf(id) > -1;
  }

  showGeometry(geometry: GeoJSON.GeoJsonObject) {
    this.dialog.open(GeometryViewComponent, {
      data: geometry,
    });
  }

  refreshData() {
    this.reloadForDatasets = [this.datasetIds[0]];
  }

  highlight(selected: boolean, id: string) {
    this.highlightId = id;
  }

  setSelected(selectedIds: string[]) {
    this.selectedIds = selectedIds;
  }

  deleteTimeseries(id: string) {
    const idx = this.datasetIds.findIndex((entry) => entry === id);
    this.datasetIds.splice(idx, 1);
    this.datasetOptions.delete(id);
  }

  changeYAxesVisibility() {
    this.d3diagramOptions.yaxis = !this.d3diagramOptions.yaxis;
  }

  updateOptions(option: DatasetOptions) {
    this.datasetOptions.set(option.internalId, option);
  }

  onGraphLoading(loading: boolean) {
    this.graphLoading = loading;
  }

  listLoadings() {
    return Array.from(this.loadings);
  }

  onOverviewLoading(loading: boolean) {
    this.overviewLoading = loading;
    this.cdr.detectChanges();
  }

  editOption(option: DatasetOptions) {
    this.dialog.open(StyleModificationComponent, {
      data: option,
    });
  }

  dateChanged(date: Date) {
    this.timespan = this.time.centerTimespan(this.timespan, date);
  }

  selectTimeseries(selected: boolean, id: string) {
    if (selected) {
      if (this.selectedIds.indexOf(id) < 0) {
        this.selectedIds.push(id);
      }
    } else {
      if (this.selectedIds.indexOf(id) >= 0) {
        this.selectedIds.splice(
          this.selectedIds.findIndex((entry) => entry === id),
          1,
        );
      }
    }
  }

  // refresh(triggered) {
  //     console.log('refresh at ' + new Date());
  // }

  groupYaxisChanged() {
    this.d3diagramOptions.groupYaxis = !this.d3diagramOptions.groupYaxis;
  }

  changeHovering(id: HoveringStyle) {
    this.hoverstyle = id;
    this.d3diagramOptions.hoverStyle = this.hoverstyle;
  }

  highlightChanged(highlightObject: HighlightOutput) {
    this.highlightedTime = new Date(highlightObject.timestamp);
  }

  /**
   * Function that is executed as soons as a hovered datapoint is clicked.
   * @param tsData {TimeseriesData[]} array of various timeseries with data at the same timestamp
   */
  clickedDataPoint(tsData: {
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

  openDownload(id: String) {
    this.dialog.open(ExportPopupComponent, {
      data: {
        id,
        timespan: this.timespan,
      },
    });
  }
}
