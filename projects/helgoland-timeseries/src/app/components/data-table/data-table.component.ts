import {
  Component,
  DoCheck,
  Input,
  IterableDiffer,
  IterableDiffers,
  inject,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { HelgolandCoreModule, Timespan } from '@helgoland/core';
import { SeriesGraphDataset } from '@helgoland/d3';
import { Subscription } from 'rxjs';

interface DatasetEventSubscriptions {
  state: Subscription;
  data: Subscription;
}

@Component({
  selector: 'helgoland-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  imports: [MatTableModule, HelgolandCoreModule],
})
export class DataTableComponent implements DoCheck {
  protected iterableDiffers = inject(IterableDiffers);

  @Input()
  public datasets: SeriesGraphDataset[] = [];
  private datasetsDiffer: IterableDiffer<SeriesGraphDataset>;

  @Input()
  timespan: Timespan | undefined;

  private subscriptions: Map<string, DatasetEventSubscriptions> = new Map();

  displayedColumns: string[] = [];
  dataSource: Table[] = [];

  constructor() {
    this.datasetsDiffer = this.iterableDiffers.find([]).create();
  }

  ngDoCheck(): void {
    const graphDatasetsChanges = this.datasetsDiffer.diff(this.datasets);
    if (graphDatasetsChanges && this.datasets) {
      graphDatasetsChanges.forEachAddedItem((addedItem) => {
        if (addedItem.item instanceof SeriesGraphDataset) {
          if (addedItem.item.hasData()) {
            this.calcData();
          }
          this.subscribeEvents(addedItem.item);
        }
      });
      graphDatasetsChanges.forEachRemovedItem((removedItem) => {
        this.calcData();
        if (removedItem.item instanceof SeriesGraphDataset) {
          this.unsubscribeEvents(removedItem.item);
        }
      });
    }
  }

  private calcData() {
    if (this.timespan === undefined) return;
    const data = this.datasets.map((ds) =>
      ds.data.map((d) => ({
        t: d.timestamp,
        v: d.value,
      })),
    );
    this.displayedColumns = ['timestamp', ...this.datasets.map((ds) => ds.id)];
    this.dataSource = buildTable(data, this.timespan);
  }

  private subscribeEvents(ds: SeriesGraphDataset) {
    let dataSubscription: Subscription;
    dataSubscription = ds.dataChangeEvent.subscribe(() => {
      this.calcData();
    });
    const events: DatasetEventSubscriptions = {
      state: ds.stateChangeEvent.subscribe(() => this.calcData()),
      data: dataSubscription,
    };
    this.subscriptions.set(ds.id, events);
  }

  private unsubscribeEvents(item: SeriesGraphDataset) {
    if (this.subscriptions.has(item.id)) {
      this.subscriptions.get(item.id)!.state.unsubscribe();
      this.subscriptions.get(item.id)!.data.unsubscribe();
      this.subscriptions.delete(item.id);
    }
  }
}

type Point = { t: number; v: number };
type Row = (number | null)[];
type Table = (string | number | null)[];

export function buildTable(series: Point[][], timespan: Timespan): Table[] {
  let timestamps = Array.from(
    new Set(series.flatMap((s) => s.map((p) => p.t))),
  ).sort((a, b) => a - b);
  const start = timestamps.findIndex((t) => t >= timespan.from);
  const end = timestamps.findLastIndex((t) => t <= timespan.to);
  timestamps = timestamps.slice(start, end + 1);

  const maps = series.map(
    (s) => new Map<number, number>(s.map((p) => [p.t, p.v])),
  );

  const rows: Row[] = timestamps.map((t) => {
    const values = maps.map((m) => m.get(t) ?? null); // null, falls Wert fehlt
    return [t, ...values];
  });

  return rows;
}
