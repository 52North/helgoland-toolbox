import {
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ColorService,
  DatasetApiInterface,
  DatasetOptions,
  InternalIdHandler,
  SumValuesService,
  Time,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { D3TimeseriesGraphComponent, InternalDataEntry } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { RangeCalculationsService } from './../helper/range-calculations.service';

/**
 * Additional Data which can be add to the component {@link ExtendedDataD3TimeseriesGraphComponent} as Input.
 * One of the optional properties 'linkedDatasetId' and 'yaxisLabel' is mandatory.
 */
export interface AdditionalData {
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
   * Internal Id connected with the dataset options
   */
  internalId: string;
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
  styleUrls: ['../d3-timeseries-graph/d3-timeseries-graph.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExtendedDataD3TimeseriesGraphComponent extends D3TimeseriesGraphComponent implements DoCheck, AfterViewInit, OnInit {

  @Input()
  public additionalData: AdditionalData[] = [];
  private additionalDataDiffer: IterableDiffer<AdditionalData>;

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected api: DatasetApiInterface,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time,
    protected timeFormatLocaleService: D3TimeFormatLocaleService,
    protected colorService: ColorService,
    protected translateService: TranslateService,
    protected sumValues: SumValuesService,
    protected rangeCalc: RangeCalculationsService
  ) {
    super(iterableDiffers, api, datasetIdResolver, timeSrvc, timeFormatLocaleService, colorService, translateService, sumValues, rangeCalc);
  }

  public ngOnInit(): void {
    this.additionalDataDiffer = this.iterableDiffers.find(this.additionalData).create();
  }

  public ngDoCheck() {
    super.ngDoCheck();
    const additionalDataChanges = this.additionalDataDiffer.diff(this.additionalData);
    if (additionalDataChanges && this.additionalData && this.graph) {
      additionalDataChanges.forEachRemovedItem((removedItem) => {
        const id = this.generateAdditionalInternalId(removedItem.item);
        let spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === id);
        if (spliceIdx >= 0) {
          this.preparedData.splice(spliceIdx, 1);
        }
      });
      this.plotGraph();
    }
  }

  public plotGraph() {
    this.prepareAdditionalData();
    super.plotGraph();
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.additionalData) {
      setTimeout(() => this.plotGraph(), 0);
    }
  }

  protected prepareYAxes() {
    super.prepareYAxes();
    this.additionalData.forEach(entry => {
      const id = this.generateAdditionalInternalId(entry);
      this.createYAxisForId(id);
    });
  }

  private prepareAdditionalData() {
    if (this.additionalData) {
      this.additionalData.forEach(entry => {
        if ((entry.linkedDatasetId || entry.yaxisLabel) && entry.data && entry.data.length > 0) {

          let options = entry.datasetOptions || this.datasetOptions.get(entry.linkedDatasetId);
          let dataset = this.datasetMap.get(entry.linkedDatasetId);
          const prepDataIdx = this.preparedData.findIndex(e => e.internalId.indexOf(entry.linkedDatasetId) > -1 || e.internalId.indexOf(entry.internalId) > -1);
          let dataEntry: InternalDataEntry;
          if (prepDataIdx === -1) {
            dataEntry = {
              internalId: this.generateAdditionalInternalId(entry),
              options,
              data: options.visible ? entry.data.map(e => ({ timestamp: e.timestamp, value: e.value })) : [],
              axisOptions: {
                uom: dataset ? dataset.uom : entry.yaxisLabel,
                label: dataset ? dataset.label : entry.yaxisLabel,
                zeroBased: options.zeroBasedYAxis,
                yAxisRange: options.yAxisRange,
                autoRangeSelection: options.autoRangeSelection,
                separateYAxis: options.separateYAxis
              },
              referenceValueData: [],
              visible: options.visible
            };
            if (dataset) {
              dataEntry.axisOptions.parameters = {
                feature: dataset.parameters.feature,
                phenomenon: dataset.parameters.phenomenon,
                offering: dataset.parameters.offering
              };
            }
            this.preparedData.push(dataEntry);
          } else {
            dataEntry = this.preparedData[prepDataIdx];
            dataEntry.axisOptions.uom = dataset ? dataset.uom : entry.yaxisLabel;
            dataEntry.axisOptions.label = dataset ? dataset.label : entry.yaxisLabel;
            dataEntry.data = options.visible ? entry.data.map(e => ({ timestamp: e.timestamp, value: e.value })) : [];
          }

          this.processData(dataEntry);

        } else {
          console.warn('Please check the additional entry, it needs at least a \'linkedDatasetId\' or a \'yaxisLabel\' property and a \'data\' property: ', entry);
        }
      });
    }
  }


  private generateAdditionalInternalId(entry: AdditionalData): string {
    return entry.linkedDatasetId ? entry.linkedDatasetId + 'add' : entry.internalId + 'add';
  }
}
