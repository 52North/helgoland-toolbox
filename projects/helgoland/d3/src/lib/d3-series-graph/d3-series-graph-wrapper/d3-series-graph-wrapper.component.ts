import {
  Component,
  inject,
  input,
  OnChanges,
  output,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import {
  ColorService,
  Data,
  DatasetOptions,
  DatasetPresenterComponent,
  DatasetType,
  HelgolandDataset,
  HelgolandTimeseries,
  HelgolandTimeseriesData,
  SumValuesService,
  Timespan,
  TimeValueTuple,
} from '@helgoland/core';
import { LangChangeEvent } from '@ngx-translate/core';
import { duration, unitOfTime } from 'moment';

import {
  D3SeriesGraphErrorHandler,
  D3SeriesSimpleGraphErrorHandler,
} from '../../d3-timeseries-graph/d3-series-graph-error-handler.service';
import { D3GraphHelperService } from '../../helper/d3-graph-helper.service';
import { D3GraphId } from '../../helper/d3-graph-id.service';
import { D3PointSymbolDrawerService } from '../../helper/d3-point-symbol-drawer.service';
import { D3HoveringService } from '../../helper/hovering/d3-hovering-service';
import { D3SimpleHoveringService } from '../../helper/hovering/d3-simple-hovering.service';
import { D3GraphCopyrightComponent } from '../controls/d3-graph-copyright/d3-graph-copyright.component';
import { D3GraphOverviewSelectionComponent } from '../controls/d3-graph-overview-selection/d3-graph-overview-selection.component';
import {
  D3SeriesGraphComponent,
  D3SeriesGraphOptions,
} from '../d3-series-graph.component';
import { HighlightOutput } from '../models/d3-highlight';
import { D3PlotOptions, HoveringStyle } from '../models/d3-plot-options';
import {
  AxisSettings,
  DatasetDescription,
  DatasetStyle,
  SeriesGraphDataset,
} from '../models/series-graph-dataset';

@Component({
  selector: 'n52-d3-series-graph-wrapper',
  templateUrl: './d3-series-graph-wrapper.component.html',
  styleUrls: ['./d3-series-graph-wrapper.component.scss'],
  providers: [D3GraphId],
  imports: [
    D3GraphCopyrightComponent,
    D3GraphOverviewSelectionComponent,
    D3SeriesGraphComponent,
  ],
})
export class D3SeriesGraphWrapperComponent
  extends DatasetPresenterComponent<DatasetOptions, D3PlotOptions>
  implements OnChanges
{
  protected sumValues = inject(SumValuesService);
  protected colorService = inject(ColorService);
  protected graphHelper = inject(D3GraphHelperService);
  protected pointSymbolDrawer = inject(D3PointSymbolDrawerService);
  protected errorHandler =
    inject(D3SeriesGraphErrorHandler, { optional: true })! ??
    new D3SeriesSimpleGraphErrorHandler();

  readonly yaxisModifier = input<boolean>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onHighlightChanged = output<HighlightOutput>();

  readonly hoveringService = input<D3HoveringService>(
    new D3SimpleHoveringService(),
  );

  readonly mainTimeInterval = input<Timespan>();

  override readonly presenterOptions = input<D3PlotOptions | undefined>({
    hoverStyle: HoveringStyle.none,
  });

  datasets: SeriesGraphDataset[] = [];
  override timespan: Timespan | undefined;

  graphOptions: D3SeriesGraphOptions = {
    grid: true,
    showTimeLabel: false,
    hoverStyle: HoveringStyle.point,
    timeRangeLabel: {
      show: false,
    },
    yaxis: true,
    yaxisModifier: true,
  };

  private readonly d3Graph = viewChild.required(D3SeriesGraphComponent);

  protected datasetMap: Map<string, HelgolandTimeseries> = new Map();

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['yaxisModifier']) {
      const yaxisModifier = this.yaxisModifier();
      this.graphOptions.yaxisModifier =
        yaxisModifier !== undefined
          ? yaxisModifier
          : this.graphOptions.yaxisModifier;
      this.drawGraph();
    }
  }

  reloadDataForDatasets(datasetIds: string[]): void {
    datasetIds.forEach((id) => {
      if (this.datasetMap.has(id)) {
        this.loadDatasetData(id);
      }
    });
  }

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void {}

  protected onTimezoneChanged(timezone: string): void {
    throw new Error('Method not implemented.');
  }

  protected timeIntervalChanges(): void {
    this.datasetMap.forEach((dataset) =>
      this.loadDatasetData(dataset.internalId),
    );
  }

  protected addDataset(id: string, url: string): void {
    this.servicesConnector
      .getDataset(
        { id, url },
        {
          locale: this.translateService.currentLang,
          type: DatasetType.Timeseries,
        },
      )
      .subscribe({
        next: (res) => this.loadAddedDataset(res),
        error: (err) => this.errorHandler.handleDatasetLoadError(err),
      });
  }

  protected removeDataset(id: string): void {
    // const dataset = this.datasetMap.get(id);
    // first remove all reference values
    // dataset.referenceValues.forEach(refVal => {
    //   const refValIdx = this.graphDatasets.findIndex(e => e.id === this.createRefValueId(id, refVal.referenceValueId));
    //   if (refValIdx >= 0) {
    //     this.graphDatasets.splice(refValIdx, 1);
    //   }
    // })
    // now delete dataset
    this.datasetMap.delete(id);
    const spliceIdx = this.datasets.findIndex((e) => e.id === id);
    if (spliceIdx >= 0) {
      this.datasets.splice(spliceIdx, 1);
    }
  }

  protected setSelectedId(id: string): void {
    const dataset = this.datasets.find((e) => e.id === id);
    if (dataset) {
      dataset.setSelected(true);
    }
    this.drawGraph();
  }

  protected removeSelectedId(id: string): void {
    const dataset = this.datasets.find((e) => e.id === id);
    if (dataset) {
      dataset.setSelected(false);
    }
    this.drawGraph();
  }

  protected presenterOptionsChanged(options: D3PlotOptions): void {
    this.graphOptions.grid =
      options.grid !== undefined ? options.grid : this.graphOptions.grid;
    this.graphOptions.hoverStyle =
      options.hoverStyle !== undefined
        ? options.hoverStyle
        : this.graphOptions.hoverStyle;
    this.graphOptions.showTimeLabel =
      options.showTimeLabel !== undefined
        ? options.showTimeLabel
        : this.graphOptions.showTimeLabel;
    this.graphOptions.timeRangeLabel =
      options.timeRangeLabel !== undefined
        ? options.timeRangeLabel
        : this.graphOptions.timeRangeLabel;
    this.graphOptions.togglePanZoom =
      options.togglePanZoom !== undefined
        ? options.togglePanZoom
        : this.graphOptions.togglePanZoom;
    this.graphOptions.yaxis =
      options.yaxis !== undefined ? options.yaxis : this.graphOptions.yaxis;
    const yaxisModifier = this.yaxisModifier();
    this.graphOptions.yaxisModifier =
      yaxisModifier !== undefined
        ? yaxisModifier
        : this.graphOptions.yaxisModifier;
    const presenterOptions = this.presenterOptions();
    if (presenterOptions) {
      presenterOptions.timespanBufferFactor =
        presenterOptions.timespanBufferFactor !== undefined
          ? presenterOptions.timespanBufferFactor
          : 0.2;
      presenterOptions.requestBeforeAfterValues =
        presenterOptions.requestBeforeAfterValues !== undefined
          ? presenterOptions.requestBeforeAfterValues
          : false;
    }
    this.drawGraph();
  }

  protected datasetOptionsChanged(
    id: string,
    options: DatasetOptions,
    firstChange: boolean,
  ): void {
    if (!firstChange) {
      const dataset = this.datasets.find((e) => e.id === id);
      if (dataset) {
        dataset.setYAxis(this.getAxisSettings(options), false);
        dataset.setStyle(this.getGraphStyle(options), false);
        dataset.setVisible(options.visible, false);
        dataset.children.forEach((child) => {
          const ref = options.showReferenceValues.find(
            (e) => e.id === child.id,
          );
          if (ref) {
            // child.setColor(ref.color);
            child.setVisible(true, false);
          } else {
            child.setVisible(false, false);
          }
        });
      }
      this.loadDatasetData(id);
    }
  }

  protected onResize(): void {}

  private loadAddedDataset(dataset: HelgolandDataset): void {
    if (dataset instanceof HelgolandTimeseries) {
      let dsEntry = this.datasets.find((e) => e.id === dataset.internalId);
      const options = this.datasetOptions()?.get(dataset.internalId);
      if (dsEntry === undefined && options) {
        const style = this.getGraphStyle(options);
        const yaxis = this.getAxisSettings(options);
        const selected =
          this.selectedDatasetIds().indexOf(dataset.internalId) >= 0;
        const description: DatasetDescription = {
          categoryLabel: dataset.parameters.category?.map((e) => e.label),
          phenomenonLabel: dataset.parameters.phenomenon?.label,
          platformLabel: dataset.platform.label,
          procedureLabel: dataset.parameters.procedure?.label,
          featureLabel: dataset.parameters.feature?.label,
          uom: dataset.uom,
          firstValue: dataset.firstValue,
          lastValue: dataset.lastValue,
        };
        dsEntry = new SeriesGraphDataset(
          dataset.internalId,
          style,
          yaxis,
          options.visible,
          selected,
          description,
        );
        dataset.referenceValues.forEach((refVal) => {
          const refVis = !!options.showReferenceValues.find(
            (ref) => ref.id === refVal.referenceValueId,
          );
          // dsEntry!.addChild(
          //   new DatasetChild(
          //     refVal.referenceValueId,
          //     refVal.label,
          //     refVis,
          //     [],
          //     '',
          //   ),
          // );
        });
        this.datasets.push(dsEntry);
      }
      this.datasetMap.set(dataset.internalId, dataset);
      this.loadDatasetData(dataset.internalId);
    } else {
      // console.error(`Dataset with internal id ${dataset.internalId} is not HelgolandTimeseries`);
    }
  }

  private loadDatasetData(id: string) {
    const datasetOptions = this.datasetOptions()?.get(id);
    const dataset = this.datasetMap.get(id);
    if (dataset && this.timespan) {
      const dsEntry = this.datasets.find((e) => e.id === dataset.internalId);
      if (dsEntry) {
        dsEntry.setDataLoading(true);
        this.informDatasetLoading(this.getLoadedDatasets());
        const presenterOptions = this.presenterOptions();
        if (
          presenterOptions?.sendDataRequestOnlyIfDatasetTimespanCovered &&
          dataset.firstValue &&
          dataset.lastValue &&
          !this.timeSrvc.overlaps(
            this.timespan,
            dataset.firstValue.timestamp,
            dataset.lastValue.timestamp,
          )
        ) {
          this.prepareData(dsEntry, new HelgolandTimeseriesData([]));
          this.onCompleteLoadingData(dsEntry);
        } else if (presenterOptions?.timespanBufferFactor) {
          const buffer = this.timeSrvc.getBufferedTimespan(
            this.timespan,
            presenterOptions.timespanBufferFactor,
            duration(1, 'day').asMilliseconds(),
          );
          this.onContentLoading.emit(true);
          // if (this.runningDataRequests.has(dataset.internalId)) {
          //   this.runningDataRequests.get(dataset.internalId).unsubscribe();
          //   this.onCompleteLoadingData(dataset);
          // }
          const request = this.servicesConnector
            .getDatasetData(dataset, buffer, {
              expanded:
                presenterOptions?.showReferenceValues ||
                presenterOptions?.requestBeforeAfterValues,
              generalize:
                presenterOptions?.generalizeAllways ||
                datasetOptions?.generalize,
            })
            .subscribe({
              next: (result) => {
                this.prepareData(dsEntry, result);
                this.onCompleteLoadingData(dsEntry);
              },
              error: (error) => {
                this.errorHandler.handleDataLoadError(error, dataset);
                this.onCompleteLoadingData(dsEntry);
              },
            });
          // if (!request.closed) {
          //   this.runningDataRequests.set(dataset.internalId, request);
          // }
        }
      }
    }
  }

  private onCompleteLoadingData(dataset: SeriesGraphDataset): void {
    // this.runningDataRequests.delete(dataset.internalId);
    dataset.setDataLoading(false);
    const loadedIds = this.getLoadedDatasets();
    this.informDatasetLoading(loadedIds);
    if (loadedIds.length === 0) {
      this.onContentLoading.emit(false);
    }
  }

  private getLoadedDatasets(): string[] {
    return this.datasets.filter((e) => e.dataLoading).map((e) => e.id);
  }

  private informDatasetLoading(ids: string[]) {
    this.dataLoaded.emit(new Set(ids));
  }

  updateTimespan(timespan: Timespan) {
    this.onTimespanChanged.emit(timespan);
  }

  datasetSelected(selectedIds: string[]) {
    this.onDatasetSelected.emit(selectedIds);
  }

  private prepareData(
    dsEntry: SeriesGraphDataset,
    rawdata: HelgolandTimeseriesData,
  ): void {
    if (rawdata instanceof HelgolandTimeseriesData) {
      // add surrounding entries to the set
      if (rawdata.valueBeforeTimespan) {
        rawdata.values.unshift(rawdata.valueBeforeTimespan);
      }
      if (rawdata.valueAfterTimespan) {
        rawdata.values.push(rawdata.valueAfterTimespan);
      }

      // const data = this.generalizer.generalizeData(rawdata, this.width, this.timespan); // TODO: eher in graph componente

      const datasetIdx = this.datasets.findIndex((e) => e.id === dsEntry.id);
      const options = this.datasetOptions()?.get(dsEntry.id);

      // sum values for bar chart visualization
      if (options && options.type === 'bar') {
        const startOf = options.barStartOf as unitOfTime.StartOf;
        const period = duration(options.barPeriod);
        if (period.asMilliseconds() === 0) {
          throw new Error(`${dsEntry.id} needs a valid barPeriod`);
        }
        rawdata.values = this.sumValues.sum(startOf, period, rawdata.values);
      }

      const data = rawdata.values.map((e) => ({
        timestamp: e[0],
        value: e[1].value,
      }));
      this.addReferenceValueDatasets(dsEntry, rawdata);
      dsEntry.setData(data);
    }
  }

  private addReferenceValueDatasets(
    ds: SeriesGraphDataset,
    rawdata: HelgolandTimeseriesData,
  ) {
    if (ds.children && ds.children.length) {
      ds.children.forEach((child) => {
        const refVals = rawdata.referenceValues[child.id];
        // debugger;
        // if (refVals) {
        //   child.setData(this.createReferenceValueData(rawdata, child.id));
        // }
      });
    }
  }

  private createReferenceValueData(
    data: Data<TimeValueTuple>,
    refId: string,
  ): { timestamp: number; value: number }[] {
    let refValues = data.referenceValues[refId] as any;
    if (!(refValues instanceof Array)) {
      if (refValues.valueBeforeTimespan) {
        refValues.values.unshift(refValues.valueBeforeTimespan);
      }
      if (refValues.valueAfterTimespan) {
        refValues.values.push(refValues.valueAfterTimespan);
      }
      refValues = refValues.values;
    }
    return refValues.map((d: any) => ({ timestamp: d[0], value: d[1] }));
  }

  private getGraphStyle(options: DatasetOptions): DatasetStyle {
    const color = options.color ? options.color : this.colorService.getColor();
    return this.graphHelper.convertDatasetOptions(options);
  }

  private getAxisSettings(options: DatasetOptions): AxisSettings {
    return new AxisSettings(
      true,
      options.separateYAxis,
      options.zeroBasedYAxis,
      options.autoRangeSelection,
      options.yAxisRange,
    );
  }

  private drawGraph() {
    const d3Graph = this.d3Graph();
    if (d3Graph) {
      d3Graph.redrawCompleteGraph();
    }
  }
}
