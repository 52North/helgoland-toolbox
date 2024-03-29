import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  public selected = false;
}

@Component({
  selector: 'n52-dataset-by-station-selector',
  templateUrl: './dataset-by-station-selector.component.html',
  styleUrls: ['./dataset-by-station-selector.component.scss'],
  standalone: true,
  imports: [NgClass, HelgolandLabelMapperModule, TzDatePipe],
})
export class DatasetByStationSelectorComponent implements OnInit {
  @Input({ required: true })
  public station!: HelgolandPlatform;

  @Input({ required: true })
  public url!: string;

  @Input()
  public defaultSelected = false;

  @Input()
  public phenomenonId: string | undefined;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  public onSelectionChanged: EventEmitter<HelgolandDataset[]> =
    new EventEmitter<HelgolandDataset[]>();

  public phenomenonMatchedList: SelectableDataset[] = [];
  public othersList: SelectableDataset[] = [];

  public counter = 0;

  constructor(
    protected servicesConnector: HelgolandServicesConnector,
    public translateSrvc: TranslateService,
  ) {}

  public ngOnInit() {
    this.servicesConnector
      .getPlatform(this.station.id, this.url, { type: DatasetType.Timeseries })
      .subscribe((station) => {
        this.station = station;
        this.counter = 0;
        this.station.datasetIds.forEach((id) => {
          this.counter++;
          this.servicesConnector
            .getDataset(
              { id: id, url: this.url },
              { type: DatasetType.Timeseries },
            )
            .subscribe({
              next: (result) =>
                this.prepareResult(
                  result as SelectableDataset,
                  this.defaultSelected,
                ),
              error: (error) => console.error(error),
              complete: () => this.counter--,
            });
        });
      });
  }

  public toggle(timeseries: SelectableDataset) {
    timeseries.selected = !timeseries.selected;
    this.updateSelection();
  }

  protected prepareResult(result: SelectableDataset, selection: boolean) {
    result.selected = selection;
    if (this.phenomenonId) {
      if (result.parameters.phenomenon?.id === this.phenomenonId) {
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
