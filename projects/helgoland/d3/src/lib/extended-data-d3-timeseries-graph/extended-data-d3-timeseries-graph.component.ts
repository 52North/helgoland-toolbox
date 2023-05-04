import {
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import {
  ColorService,
  DatasetOptions,
  HelgolandServicesConnector,
  InternalIdHandler,
  SumValuesService,
  Time,
  TimezoneService,
} from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { D3TimeseriesGraphComponent } from '../d3-timeseries-graph/d3-timeseries-graph.component';
import { D3GraphHelperService } from '../helper/d3-graph-helper.service';
import { D3GraphId } from '../helper/d3-graph-id.service';
import { D3PointSymbolDrawerService } from '../helper/d3-point-symbol-drawer.service';
import { D3TimeFormatLocaleService } from '../helper/d3-time-format-locale.service';
import { DataConst, InternalDataEntry } from '../model/d3-general';
import { D3Graphs } from './../helper/d3-graphs.service';
import { RangeCalculationsService } from './../helper/range-calculations.service';
import { D3GraphOverviewSelectionComponent } from '../d3-timeseries-graph/controls/d3-graph-overview-selection/d3-graph-overview-selection.component';
import { D3GraphHoverPointComponent } from '../d3-timeseries-graph/controls/d3-graph-hover-point/d3-graph-hover-point.component';
import { D3GraphHoverLineComponent } from '../d3-timeseries-graph/controls/d3-graph-hover-line/d3-graph-hover-line.component';
import { NgIf } from '@angular/common';
import { D3GraphCopyrightComponent } from '../d3-timeseries-graph/controls/d3-graph-copyright/d3-graph-copyright.component';
import { D3GraphPanZoomInteractionComponent } from '../d3-timeseries-graph/controls/d3-graph-pan-zoom-interaction/d3-graph-pan-zoom-interaction.component';

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
    providers: [D3GraphId],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [D3GraphPanZoomInteractionComponent, D3GraphCopyrightComponent, NgIf, D3GraphHoverLineComponent, D3GraphHoverPointComponent, D3GraphOverviewSelectionComponent]
})
export class ExtendedDataD3TimeseriesGraphComponent extends D3TimeseriesGraphComponent implements DoCheck, AfterViewInit {

  @Input()
  public additionalData: AdditionalData[] = [];
  private additionalDataDiffer: IterableDiffer<AdditionalData> = this.iterableDiffers.find(this.additionalData).create();

  constructor(
    protected override iterableDiffers: IterableDiffers,
    protected override datasetIdResolver: InternalIdHandler,
    protected override timeSrvc: Time,
    protected override timeFormatLocaleService: D3TimeFormatLocaleService,
    protected override colorService: ColorService,
    protected override translateService: TranslateService,
    protected override timezoneSrvc: TimezoneService,
    protected override sumValues: SumValuesService,
    protected override rangeCalc: RangeCalculationsService,
    protected override graphHelper: D3GraphHelperService,
    protected override graphService: D3Graphs,
    protected override graphIdService: D3GraphId,
    protected override servicesConnector: HelgolandServicesConnector,
    protected override pointSymbolDrawer: D3PointSymbolDrawerService,
    protected override zone: NgZone,
  ) {
    super(
      iterableDiffers,
      datasetIdResolver,
      timeSrvc,
      timeFormatLocaleService,
      colorService,
      translateService,
      timezoneSrvc,
      sumValues,
      rangeCalc,
      graphHelper,
      graphService,
      graphIdService,
      servicesConnector,
      pointSymbolDrawer,
      zone
    );
  }

  public override ngDoCheck() {
    super.ngDoCheck();
    const additionalDataChanges = this.additionalDataDiffer.diff(this.additionalData);
    if (additionalDataChanges && this.additionalData && this.graph) {
      additionalDataChanges.forEachRemovedItem((removedItem) => {
        const id = this.generateAdditionalInternalId(removedItem.item);
        const spliceIdx = this.preparedData.findIndex((entry) => entry.internalId === id);
        if (spliceIdx >= 0) {
          this.preparedData.splice(spliceIdx, 1);
        }
      });
      this.redrawCompleteGraph();
    }
  }

  public override redrawCompleteGraph() {
    this.prepareAdditionalData();
    super.redrawCompleteGraph();
  }

  public override ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected override timeIntervalChanges(): void {
    if (this.datasetMap.size > 0) {
      super.timeIntervalChanges();
    } else {
      this.redrawCompleteGraph();
    }
  }

  protected override prepareYAxes() {
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
          const options = this.getOptions(entry);
          const dataset = entry.linkedDatasetId ? this.datasetMap.get(entry.linkedDatasetId) : undefined;
          const prepDataIdx = this.preparedData.findIndex(e => e.internalId.indexOf(entry.linkedDatasetId!) > -1 || e.internalId.indexOf(entry.internalId) > -1);
          let dataEntry: InternalDataEntry | undefined = undefined;
          if (options) {
            if (prepDataIdx === -1) {
              dataEntry = {
                internalId: this.generateAdditionalInternalId(entry),
                hoverId: `hov-${Math.random().toString(36).substr(2, 9)}`,
                options,
                data: options.visible ? entry.data.map(e => ({ timestamp: e.timestamp, value: e.value })) : [],
                axisOptions: {
                  uom: this.getUom(dataset, entry),
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
                dataEntry!.axisOptions.parameters = {
                  feature: dataset.parameters.feature,
                  phenomenon: dataset.parameters.phenomenon,
                  offering: dataset.parameters.offering
                };
              }
              this.preparedData.push(dataEntry!);
            } else {
              dataEntry = this.preparedData[prepDataIdx];
              dataEntry.axisOptions.uom = this.getUom(dataset, entry);
              dataEntry.axisOptions.label = dataset ? dataset.label : entry.yaxisLabel;
              dataEntry.data = options.visible ? entry.data.map(e => ({ timestamp: e.timestamp, value: e.value })) : [];
            }
            this.processData(dataEntry!);
          }

        } else {
          console.warn('Please check the additional entry, it needs at least a \'linkedDatasetId\' or a \'yaxisLabel\' property and a \'data\' property: ', entry);
        }
      });
    }
  }

  private getUom(dataset: DataConst | undefined, entry: AdditionalData): string {
    if (dataset) return dataset.uom;
    if (entry.yaxisLabel) return entry.yaxisLabel;
    return '';
  }

  private getOptions(entry: AdditionalData) {
    if (entry.datasetOptions) {
      return entry.datasetOptions;
    } else if (entry.linkedDatasetId && this.datasetOptions?.get(entry.linkedDatasetId)) {
      return this.datasetOptions?.get(entry.linkedDatasetId);
    }
    return undefined;
  }

  private generateAdditionalInternalId(entry: AdditionalData): string {
    return entry.linkedDatasetId ? entry.linkedDatasetId + 'add' : entry.internalId + 'add';
  }
}
