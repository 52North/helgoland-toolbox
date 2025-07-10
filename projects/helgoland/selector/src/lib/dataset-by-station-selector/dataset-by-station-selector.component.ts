import { NgClass } from '@angular/common';
import { Component, OnInit, inject, input, output } from '@angular/core';
import {
  DatasetType,
  HelgolandDataset,
  HelgolandPlatform,
  HelgolandServicesConnector,
  HelgolandTimeseries,
  TzDatePipe,
} from '@helgoland/core';
import { HelgolandLabelMapperModule } from '@helgoland/depiction';
import { TranslateService } from '@ngx-translate/core';

export class SelectableDataset extends HelgolandTimeseries {
  selected = false;
}

@Component({
  selector: 'n52-dataset-by-station-selector',
  templateUrl: './dataset-by-station-selector.component.html',
  styleUrls: ['./dataset-by-station-selector.component.scss'],
  imports: [NgClass, HelgolandLabelMapperModule, TzDatePipe],
})
export class DatasetByStationSelectorComponent implements OnInit {
  protected servicesConnector = inject(HelgolandServicesConnector);
  protected translateSrvc = inject(TranslateService);

  readonly station = input.required<HelgolandPlatform>();

  readonly url = input.required<string>();

  readonly defaultSelected = input(false);

  readonly phenomenonId = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onSelectionChanged = output<HelgolandDataset[]>();

  phenomenonMatchedList: SelectableDataset[] = [];
  othersList: SelectableDataset[] = [];

  counter = 0;

  ngOnInit() {
    this.servicesConnector
      .getPlatform(this.station().id, this.url(), {
        type: DatasetType.Timeseries,
      })
      .subscribe((station) => {
        // this.station = station;
        this.counter = 0;
        station.datasetIds.forEach((id) => {
          this.counter++;
          this.servicesConnector
            .getDataset(
              { id: id, url: this.url() },
              { type: DatasetType.Timeseries },
            )
            .subscribe({
              next: (result) =>
                this.prepareResult(
                  result as SelectableDataset,
                  this.defaultSelected(),
                ),
              error: (error) => console.error(error),
              complete: () => this.counter--,
            });
        });
      });
  }

  toggle(timeseries: SelectableDataset) {
    timeseries.selected = !timeseries.selected;
    this.updateSelection();
  }

  protected prepareResult(result: SelectableDataset, selection: boolean) {
    result.selected = selection;
    const phenomenonId = this.phenomenonId();
    if (phenomenonId) {
      if (result.parameters.phenomenon?.id === phenomenonId) {
        this.phenomenonMatchedList.push(result);
      } else {
        this.othersList.push(result);
      }
    } else {
      this.phenomenonMatchedList.push(result);
    }
    this.updateSelection();
  }

  private updateSelection() {
    const selection = this.phenomenonMatchedList.filter(
      (entry) => entry.selected,
    );
    this.onSelectionChanged.emit(selection);
  }
}
