import { Component, Input, IterableDiffers, OnChanges, SimpleChanges } from '@angular/core';
import { ColorService, DatasetApiInterface, DatasetOptions, InternalIdHandler, Time } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';
import { extent } from 'd3';

import { D3TimeseriesGraphComponent, InternalDataEntry } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';

/**
 * Additional Data which can be add to the component {@link ExtendedDataD3TimeseriesGraphComponent} as Input.
 * One of the optional properties 'linkedDatasetId' and 'yaxisLabel' is mandatory.
 */
export interface AddtionalData {
  /**
   * Linked to an existing dataset in the graph component and uses it dataset options if no other datasetoptions are presented.
   */
  linkedDatasetId?: string;
  /**
   * Y-Axis label if no link to an existing dataset is given.
   */
  yaxisLabel?: string;
  /**
   * The dataset options, which describes the styling of the additional data.
   */
  datasetOptions?: DatasetOptions;
  /**
   * The additional data arrey with tupels of timestamp and value.
   */
  data: AdditionalDataEntry[];
}

/**
 * Additional data entry tuple
 */
export interface AdditionalDataEntry {
  timestamp: number;
  value: number;
}

/**
 * Extends the common d3 component, with the ability to add additional data to the graph. To set or change  additional data, allways sets the complete array of data new. The componet just redraws if
 * the array is reset.
 */
@Component({
  selector: 'n52-extended-data-d3-timeseries-graph',
  templateUrl: '../d3-timeseries-graph/d3-timeseries-graph.component.html',
  styleUrls: ['../d3-timeseries-graph/d3-timeseries-graph.component.scss']
})
export class ExtendedDataD3TimeseriesGraphComponent extends D3TimeseriesGraphComponent implements OnChanges {

  @Input()
  public additionalData: AddtionalData[] = [];

  private additionalPreparedData: InternalDataEntry[] = [];

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected api: DatasetApiInterface,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected timeFormatLocaleService: D3TimeFormatLocaleService,
    protected colorService: ColorService,
    protected translateService: TranslateService
  ) {
    super(iterableDiffers, api, datasetIdResolver, timeSrvc, timeFormatLocaleService, colorService, translateService);
  }

  public ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes.additionalData && this.additionalData) {
      this.clearAdditionalData();
      this.plotGraph();
    }
  }

  protected plotGraph() {
    this.prepareAdditionaData();
    super.plotGraph();
  }

  private clearAdditionalData() {
    this.additionalPreparedData.forEach(data => {
      this.yRangesEachUom.forEach(e => {
        const idx = e.ids.indexOf(data.internalId);
        if (idx > -1) { e.ids.splice(idx, 1); }
      });
    });

    for (let i = this.yRangesEachUom.length - 1; i >= 0; i--) {
      const element = this.yRangesEachUom[i];
      if (element.ids.length === 0) {
        this.yRangesEachUom.splice(i, 1);
      }
    }

    this.additionalPreparedData = [];
  }

  private prepareAdditionaData() {
    this.additionalData.forEach(entry => {
      let options = entry.datasetOptions || this.datasetOptions.get(entry.linkedDatasetId);
      let dataset = this.datasetMap.get(entry.linkedDatasetId);

      const prepDataIdx = this.additionalPreparedData.findIndex(e => e.internalId.startsWith(entry.linkedDatasetId) || e.internalId === entry.yaxisLabel);
      let dataEntry: InternalDataEntry;
      if (prepDataIdx === -1) {
        dataEntry = {
          internalId: entry.linkedDatasetId ? entry.linkedDatasetId + 'add' : entry.yaxisLabel,
          color: options.color,
          data: options.visible ? entry.data.map(e => [e.timestamp, e.value]) as [number, number][] : [],
          points: {
            fillColor: options.color
          },
          lines: {
            lineWidth: options.lineWidth,
            pointRadius: options.pointRadius
          },
          bars: {
            lineWidth: options.lineWidth
          },
          axisOptions: {
            uom: dataset ? dataset.uom : entry.yaxisLabel,
            label: dataset ? dataset.label : entry.yaxisLabel,
            zeroBased: options.zeroBasedYAxis,
            yAxisRange: options.yAxisRange,
            autoRangeSelection: options.autoRangeSelection
          },
          visible: options.visible
        };
        this.additionalPreparedData.push(dataEntry);
      } else {
        dataEntry = this.additionalPreparedData[prepDataIdx];
      }

      const newDatasetIdx = this.yRangesEachUom.findIndex((e) => e.ids.indexOf(entry.linkedDatasetId) > -1);
      const dataExtent = extent<[number, number], number>(dataEntry.data, (datum) => datum[1]);

      if (newDatasetIdx === -1) {
        const existingAxisIndex = this.yRangesEachUom.findIndex(e => e.ids.indexOf(entry.yaxisLabel) !== -1);
        const axisRange = {
          uom: entry.yaxisLabel,
          range: { min: dataExtent[0], max: dataExtent[1] },
          autoRange: options.autoRangeSelection,
          preRange: { min: dataExtent[0], max: dataExtent[1] },
          originRange: { min: dataExtent[0], max: dataExtent[1] },
          zeroBased: options.zeroBasedYAxis,
          outOfrange: false,
          ids: [entry.yaxisLabel]
        };
        if (existingAxisIndex > -1) {
          this.yRangesEachUom[existingAxisIndex] = axisRange;
        } else {
          this.yRangesEachUom.push(axisRange);
        }
      } else {
        this.yRangesEachUom[newDatasetIdx].range = {
          min: Math.min(dataExtent[0], this.yRangesEachUom[newDatasetIdx].range.min),
          max: Math.max(dataExtent[1], this.yRangesEachUom[newDatasetIdx].range.max)
        };
      }
    });
  }

  protected drawAllGraphLines() {
    super.drawAllGraphLines();
    this.additionalPreparedData.forEach(e => this.drawGraphLine(e));
  }

}
