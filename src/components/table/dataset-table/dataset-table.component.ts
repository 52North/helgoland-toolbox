import { Component, OnInit, Input, IterableDiffers } from '@angular/core';
import { TimeInterval } from '../../../model/internal/timeInterval';
import { DatasetGraphComponent } from '../../graph/dataset-graph.component';
import { DatasetOptions } from './../../../model/internal/options';
import { PlotOptions } from './../../graph/flot/model/plotOptions';
import { ApiInterface } from './../../../services/api-interface/api-interface';
import { InternalIdHandler } from './../../../services/api-interface/internal-id-handler.service';
import { Time } from './../../../services/time/time.service';
import { Timeseries } from './../../../model/api/dataset';
import { Data } from '../../../model/api/data';
import { DatasetTableData } from '../../../model/internal/dataset-table-data';

@Component({
  selector: 'n52-dataset-table',
  templateUrl: './dataset-table.component.html',
  styleUrls: ['./dataset-table.component.scss']
})
export class DatasetTableComponent extends DatasetGraphComponent<DatasetOptions, PlotOptions> implements OnInit {
  /*
    The component extends DatasetGraphComponent, but implements only parts of that components inputs and outputs.
    Implemented: datasetIds and timeInterval inputs; no outputs
    Not implemented: selectedDatasetIds, datasetOptions, graphOptions inputs;
    all outputs (pmDatasetSelected, onTimespanChanged, onMessageThrown, onLoading)
  */

  public preparedData: DatasetTableData[] = Array();
  public preparedTimeserieses: Timeseries[] = Array();
  private timeseriesMap: Map<string, Timeseries> = new Map();

  constructor(
    protected iterableDiffers: IterableDiffers,
    protected api: ApiInterface,
    protected datasetIdResolver: InternalIdHandler,
    protected timeSrvc: Time
  ) {
    super(iterableDiffers, api, datasetIdResolver, timeSrvc);
  }

  public ngOnInit() {
    console.log(this.datasetIds);
  }

  /* called when user clicks on table headers */
  public sort(event: any) {
    // can be 'datetime' or an integer indicating the index of the column in the values array
    const by = event.target.dataset.columnId;
    const direction = event.target.classList.contains('sorted-asc') ? 'desc' : 'asc';
    const directionNumber = (direction === 'asc' ? 1 : -1);

    // set CSS classes
    Array.from(event.target.parentElement.children).forEach((child: any) => child.classList = '');
    event.target.classList.toggle('sorted-asc', direction === 'asc');
    event.target.classList.toggle('sorted-desc', direction === 'desc');

    // define correct callback function for sort method
    let sortCallback;
    if (by === 'datetime') {
      sortCallback = (e1: any, e2: any) => directionNumber * (e1.datetime - e2.datetime);
    } else {
      const index = parseInt(by, 10);
      // basically the same as above, but take care of 'undefined' values
      sortCallback = (e1: any, e2: any) =>
        (e1.values[index] === undefined ? 1 :
          (e2.values[index] === undefined ? -1 :
            (directionNumber * (e1.values[index] - e2.values[index]))
          )
        );
    }

    // do the sort
    this.preparedData = this.preparedData.sort(sortCallback);
  }

  // TODO-CF: Blind copy&paste from abstract parent class to make it compile
  protected graphOptionsChanged(options: PlotOptions) {
    /*this.plotOptions = options;
    this.plotOptions.yaxes = [];
    this.timeIntervalChanges();*/
  }

  protected setSelectedId(internalId: string) {
    /*const tsData = this.preparedData.find(e => e.internalId === internalId);
    tsData.selected = true;
    tsData.lines.lineWidth = 5;
    tsData.bars.lineWidth = 5;
    this.plotGraph();*/
  }

  protected removeSelectedId(internalId: string) {
    /*const tsData = this.preparedData.find(e => e.internalId === internalId);
    tsData.selected = false;
    tsData.lines.lineWidth = 1;
    tsData.bars.lineWidth = 1;
    this.plotGraph();*/
  }

  protected timeIntervalChanges() {
    /*this.timeseriesMap.forEach(timeseries => {
        this.loadTsData(timeseries);
    });*/
  }

  protected removeDataset(internalId: string) {
    /*this.timeseriesMap.delete(internalId);
    this.removePreparedData(internalId);
    this.plotGraph();*/
  }

  protected addDataset(internalId: string, url: string): void {
    this.api.getSingleTimeseries(internalId, url)
      .subscribe((timeseries: Timeseries) => this.addTimeseries(timeseries));
  }

  protected datasetOptionsChanged(internalId: string, options: DatasetOptions): void {
    /*if (this.timeseriesMap.has(internalId)) {
        this.loadTsData(this.timeseriesMap.get(internalId));
    }*/
  }

  protected onResize(): void {
    /*this.plotGraph();*/
  }

  private addTimeseries(timeseries: Timeseries) {
    this.timeseriesMap.set(timeseries.internalId, timeseries);
    this.loadTsData(timeseries);
  }

  private loadTsData(timeseries: Timeseries) {
    if (this.timespan) {
      const buffer = this.timeSrvc.getBufferedTimespan(this.timespan, 0.2);
      // const datasetOptions = this.datasetOptions.get(timeseries.internalId);
      this.api.getTsData<[number, number]>(timeseries.id, timeseries.url, buffer, { format: 'flot' })
        .subscribe((result) => {
          // bring result into Array<DatasetTableData> format and pass to prepareData
          this.prepareData(timeseries, result.values.map((e) => ({ datetime: e[0], values: [e[1]] })));
        });
    }
  }

  private prepareData(timeseries: Timeseries, newdata: DatasetTableData[]) {
    // this doesn't guarantee order:
    // this.timeseriesarray = Array.from(this.timeseriesMap.values());
    // so use array instead:
    this.preparedTimeserieses.push(timeseries);

    // `newdata` is expected in exactly the same format `preparedData` would look like if there's only 1 timeseries

    // `timeseries` is first timeseries added -> no other `preparedData` to merge with -> `preparedData` can be set
    // to `newdata` (as per above)
    if (this.preparedData.length === 0) {
      this.preparedData = newdata;

      // `timeseries` is not the first timeseries added -> we have to merge `newdata` into the existing `preparedData`
    } else {
      let i = 0;  // loop variable for `preparedData`
      let j = 0;  // loop variable for `newdata`

      // go through all data points in `newdata`
      while (j < newdata.length) {

        // timestamps match
        if (this.preparedData[i] && this.preparedData[i].datetime === newdata[j].datetime) {
          // easiest case - just add `newdata`'s value to the existing `values` array in `preparedData`
          this.preparedData[i].values.push(newdata[j].values[0]);
          // increment both
          i++;
          j++;

          // `newdata` is ahead of `preparedData`
        } else if (this.preparedData[i] && this.preparedData[i].datetime < newdata[j].datetime) {
          // there is no information in `newdata` for `preparedData`'s current timestamp -> add `undefined` to `preparedData`
          this.preparedData[i].values.push(undefined);
          // give preparedData the chance to catch up with newdata
          i++;

          // `preparedData` is ahead of `newdata`
        } else {
          // there was no information in any of the previous timeserieses' `newdata`s for the current `newdata`'s current
          // timestamp -> create new, empty timestamp in `preparedData`
          this.preparedData.splice(i, 0, { datetime: newdata[j].datetime, values: [] });
          // fill previous timeserieses' slots in the `values` array with `undefined`
          this.preparedData[i].values = Array(this.preparedTimeserieses.length - 1).fill(undefined);
          // add `newdata`'s value to the now existing `values` array in `preparedData`
          // (exactly like in the "timestamps match" case)
          this.preparedData[i].values.push(newdata[j].values[0]);
          // give newdata the chance to catch up with preparedData
          j++;
          // but preparedData is 1 longer now, too
          i++;
        }
      }

      // take care of elements in `preparedData` that are later than the last element of `newdata`
      while (i < this.preparedData.length) {
        this.preparedData[i].values.push(undefined);
        i++;
      }
    }
  }
}
