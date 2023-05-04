import { Component, IterableDiffers, OnInit } from '@angular/core';
import { DatasetOptions, DatasetPresenterComponent, DatasetTableData, DatasetType, HelgolandServicesConnector, HelgolandTimeseries, HelgolandTimeseriesData, InternalIdHandler, Time, TimezoneService, TzDatePipe } from '@helgoland/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { NgIf, NgFor, NgStyle } from '@angular/common';

@Component({
    selector: 'n52-dataset-table',
    templateUrl: './dataset-table.component.html',
    styleUrls: ['./dataset-table.component.scss'],
    standalone: true,
    imports: [NgIf, NgFor, NgStyle, TzDatePipe]
})
export class DatasetTableComponent extends DatasetPresenterComponent<DatasetOptions, any> implements OnInit {
  /*
    The component extends DatasetGraphComponent, but implements only parts of that components inputs and outputs.
    Implemented: datasetIds, timeInterval, selectedDatasetIds and datasetOptions inputs; no outputs
    Not implemented: graphOptions input; all outputs (onDatasetSelected, onTimespanChanged, onMessageThrown, onLoading)
  */

  public preparedData: DatasetTableData[] = Array();
  public preparedColors: string[] = Array();
  public ready = false;

  public timeseriesArray: HelgolandTimeseries[] = new Array();
  private additionalStylesheet!: HTMLElement;

  constructor(
    protected override iterableDiffers: IterableDiffers,
    protected override servicesConnector: HelgolandServicesConnector,
    protected override datasetIdResolver: InternalIdHandler,
    protected override timeSrvc: Time,
    protected translateSrvc: TranslateService,
    protected override timezoneSrvc: TimezoneService
  ) {
    super(iterableDiffers, servicesConnector, datasetIdResolver, timeSrvc, translateSrvc, timezoneSrvc);
  }

  public ngOnInit() {
    const elem = document.getElementById('selectedIdsStylesheet')
    if (elem) {
      this.additionalStylesheet = elem;
    } else {
      this.additionalStylesheet = document.createElement('style');
      this.additionalStylesheet.id = 'selectedIdsStylesheet';
      document.body.appendChild(this.additionalStylesheet);
    }
  }

  /* called when user clicks on table headers */
  public sort(event: any) {
    // can be 'datetime' or an integer indicating the index of the column in the values array
    const by = event.target.dataset.columnId;
    const direction = event.target.classList.contains('sorted-asc') ? 'desc' : 'asc';
    const directionNumber = (direction === 'asc' ? 1 : -1);

    // set CSS classes
    (Array.from(event.target.parentElement.children) as Element[]).forEach(child => child.className = '');
    if (direction === 'asc') {
      (event.target as Element).classList.add('sorted-asc');
    } else {
      (event.target as Element).classList.add('sorted-desc');
    }

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

  protected onLanguageChanged(langChangeEvent: LangChangeEvent): void { }

  protected onTimezoneChanged(timezone: string): void { }

  public reloadDataForDatasets(datasetIds: string[]): void {
    // console.log('reload data at ' + new Date());
  }

  protected presenterOptionsChanged(options: any) {
    // only included because it's required by abstract parent class (wouldn't compile without)
    // no point in implementing this method in a non-graphing component
  }

  protected getIndexFromInternalId(internalId: string) {
    // helper method
    return this.datasetIds.indexOf(internalId);
  }

  protected setSelectedId(internalId: string) {
    // quite fairly tested
    const rules = this.additionalStylesheet.innerHTML.split('\r\n');
    const index = this.getIndexFromInternalId(internalId);
    rules[index] = 'td:nth-child(' + (index + 2) + ') {font-weight: bold}';
    this.additionalStylesheet.innerHTML = rules.join('\r\n');
  }

  protected removeSelectedId(internalId: string) {
    // fairly tested
    const rules = this.additionalStylesheet.innerHTML.split('\r\n');
    const index = this.getIndexFromInternalId(internalId);
    rules[index] = '';
    this.additionalStylesheet.innerHTML = rules.join('\r\n');
  }

  protected timeIntervalChanges() {
    // the easiest method: delete everything and build preparedData from scratch.
    this.preparedData = [];
    this.timeseriesArray.forEach((timeseries) => this.loadTsData(timeseries));
  }

  protected removeDataset(internalId: string) {
    // fairly tested
    const index = this.getIndexFromInternalId(internalId);

    // remove entries of this dataset in each datetime's `values` arrays
    this.preparedData.forEach((e) => e.values.splice(index, 1));
    // if a datetime became completely empty (i.e. there's only `undefined`s in the `values` array, delete this datetime)
    // @ts-ignore
    this.preparedData = this.preparedData.filter((e) => e.values.reduce((a, c) => a || c, undefined) !== undefined);

    this.preparedColors.splice(index, 1);

    const rules = this.additionalStylesheet.innerHTML.split('\r\n');
    rules.splice(index, 1);
    this.additionalStylesheet.innerHTML = rules.join('\r\n');

    this.timeseriesArray.splice(index, 1);
  }

  protected addDataset(id: string, url: string): void {
    this.timeseriesArray.length += 1;  // create new empty slot
    this.preparedColors.push('darkgrey');
    this.additionalStylesheet.innerHTML += '\r\n';
    this.servicesConnector.getDataset({ id, url }, { type: DatasetType.Timeseries })
      .subscribe(ds => this.addTimeseries(ds));
  }

  protected datasetOptionsChanged(internalId: string, options: DatasetOptions): void {
    if (this.timeseriesArray.some((e) => e !== undefined && e.internalId === internalId)) {
      const index = this.getIndexFromInternalId(internalId);
      this.preparedColors[index] = options.color;
      // TODO-CF: Page isn't refreshed instantly, but only after the next sort (or possible other actions as well)
    }
  }

  protected onResize(): void {
    // TODO-CF: needed???? probably not
  }

  private addTimeseries(timeseries: HelgolandTimeseries) {
    this.timeseriesArray[this.getIndexFromInternalId(timeseries.internalId)] = timeseries;
    this.loadTsData(timeseries);
  }

  private loadTsData(timeseries: HelgolandTimeseries) {
    if (this.timespan) {
      // const datasetOptions = this.datasetOptions.get(timeseries.internalId);
      this.servicesConnector.getDatasetData(timeseries, this.timespan).subscribe(
        result => {
          // bring result into Array<DatasetTableData> format and pass to prepareData
          // convention for layout of newdata argument: see 3-line-comment in prepareData function
          if (result instanceof HelgolandTimeseriesData) {
            const index = this.getIndexFromInternalId(timeseries.internalId);
            this.prepareData(timeseries, result.values.map((e) => {
              const a = new Array(this.datasetIds.length).fill(undefined);
              a[index] = e[1];
              return { datetime: e[0], values: a };
            }));
          }
        }
      );
    }
  }

  private prepareData(timeseries: HelgolandTimeseries, newdata: DatasetTableData[]) {
    const index = this.getIndexFromInternalId(timeseries.internalId);

    // if datasetOptions are provided, use their color to style the header's "color band" (i.e. the 7px border-bottom of th)
    const option = this.datasetOptions?.get(timeseries.internalId);
    if (option) {
      this.preparedColors[index] = option.color;
    } else {
      // when no color is specified: make border transparent so the header's background color is used for the color band, too
      this.preparedColors[index] = 'rgba(0,0,0,0)';
    }

    if (this.selectedDatasetIds.indexOf(timeseries.internalId) !== -1) {
      this.setSelectedId(timeseries.internalId);
    }

    // `newdata` is expected in exactly the same format `preparedData` would look like if that timeseries was the only one
    // to actually have data (i.e. `values` has the length of timeseriesArray, but all slots are `undefined`, except for
    // the slot that corresponds to that timeseries)

    // `timeseries` is first timeseries added -> no other `preparedData` to merge with
    if (this.preparedData.length === 0) {
      // set newdata as preparedData (as per above)
      this.preparedData = newdata;

      // `timeseries` is not the first timeseries added -> we have to merge `newdata` into the existing `preparedData`
    } else {
      let i = 0;  // loop variable for `preparedData`
      let j = 0;  // loop variable for `newdata`

      // go through all data points in `newdata`
      while (j < newdata.length) {

        // timestamps match
        if (this.preparedData[i] && this.preparedData[i].datetime === newdata[j].datetime) {
          // just add `newdata`'s value to the existing `values` array in `preparedData`
          this.preparedData[i].values[index] = newdata[j].values[index];
          // increment both
          i++;
          j++;

          // `newdata` is ahead of `preparedData`
        } else if (this.preparedData[i] && this.preparedData[i].datetime < newdata[j].datetime) {
          // do nothing because there's already an undefined there
          // give preparedData the chance to catch up with newdata
          i++;

          // `preparedData` is ahead of `newdata`
        } else {
          // the current `newdata` is the first dataset that has this datetime -> add it to the preparedData array
          this.preparedData.splice(i, 0, newdata[j]);
          // give newdata the chance to catch up with preparedData
          j++;
          // but preparedData is 1 longer now, too
          i++;
        }
      }
    }

    this.ready = this.timeseriesArray.every((e) => e !== undefined);
  }
}
