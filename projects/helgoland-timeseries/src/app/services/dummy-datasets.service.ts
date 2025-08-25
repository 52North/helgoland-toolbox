import { Injectable, inject } from '@angular/core';
import { LocalStorage } from '@helgoland/core';
import {
  AxisSettings,
  DatasetStyle,
  LineStyle,
  SeriesGraphDataset,
  TimeseriesChild
} from '@helgoland/d3';

import { Favorite } from './favorite.service';
import { DatasetsService } from './graph-datasets.service';
import {
  DatasetFavoriteService,
  DatasetStateService,
} from './service-interfaces';

const DATASET_ID: string = 'DUMMY_DATASET_ID';

const DUMMY_DATASET_LOCAL_STORAGE_KEY = 'DUMMY_DATASET_LOCAL_STORAGE';
@Injectable({
  providedIn: 'root',
})
export class DummyDatasetsService
  implements DatasetStateService, DatasetFavoriteService
{
  protected graphDatasetsSrvc = inject(DatasetsService);
  protected localStorage = inject(LocalStorage);

  private addRandomDataset() {
    const dummyDataset = this.createNewDataset('blue');
    const child = new TimeseriesChild(
      DATASET_ID,
      'ChildData',
      false,
      [
        {
          value: 1.2,
          timestamp: new Date().getTime() - 360 * 1000,
        },
        {
          value: 1.8,
          timestamp: new Date().getTime() + 360 * 1000,
        },
      ],
      'green',
    );
    dummyDataset.addChild(child);
    this.graphDatasetsSrvc.addOrUpdateDataset(dummyDataset);
    this.addNewValue();
    const interval = setInterval(() => this.addNewValue(), 5000);
    this.saveOnCache(dummyDataset);
    dummyDataset.deleteEvent.subscribe((res) => {
      clearInterval(interval);
      return this.removeFromCache(res.id);
    });
  }

  private addNewValue() {
    const timestamp = new Date().getTime() + 1;
    const value = this.createValue();
    this.graphDatasetsSrvc
      .getDatasetEntry(DATASET_ID)
      .addNewData(timestamp, value, true);
    this.graphDatasetsSrvc
      .getOverviewDatasetEntry(DATASET_ID)
      .addNewData(timestamp, value, false);
  }

  private createValue(): number {
    return Math.floor(Math.random() * 10);
  }

  private createNewDataset(color: string): SeriesGraphDataset {
    return new SeriesGraphDataset(
      DATASET_ID,
      new LineStyle(color, 3, 2),
      new AxisSettings(),
      true,
      false,
      {
        uom: 'rnd',
        phenomenonLabel: 'Zahlen zwischne 0 und 10',
        categoryLabel: ['random', '0 and 10'],
      },
    );
  }

  private removeFromCache(id: string) {
    this.localStorage.removeItem(DUMMY_DATASET_LOCAL_STORAGE_KEY);
  }

  private saveOnCache(dummyDataset: SeriesGraphDataset<DatasetStyle>) {
    this.localStorage.save(DUMMY_DATASET_LOCAL_STORAGE_KEY, true);
  }

  handleStoredDs(dsId: string): boolean {
    const cached = this.localStorage.load(DUMMY_DATASET_LOCAL_STORAGE_KEY);
    if (dsId === DATASET_ID && cached) {
      this.addRandomDataset();
      return true;
    }
    return false;
  }

  getPermaId(ds: SeriesGraphDataset): string | undefined {
    return undefined;
  }

  validatePermaId(id: string): boolean {
    return false;
  }

  /** asdf methods */
  addFavoriteToDiagram(fav: Favorite): void {
    this.addRandomDataset();
  }

  updateFavoriteLabel(fav: Favorite, label: string): void {
    throw new Error('Method not implemented.');
  }

  canHandleDatasetAsFavorite(id: string): boolean {
    return id === DATASET_ID;
  }

  getFavorites(): Favorite[] {
    return [
      {
        id: DATASET_ID,
        description: {
          uom: 'rnd',
        },
        label: 'Dummy dataset with random values',
      },
    ];
  }

  isFavorite(id: string): boolean {
    return id === DATASET_ID;
  }

  getFavorite(id: string): Favorite {
    throw new Error('Method not implemented.');
  }

  createFavorite(ds: SeriesGraphDataset<DatasetStyle>): Favorite {
    throw new Error('Method not implemented.');
  }

  removeFavorite(id: string): void {
    // throw new Error('Method not implemented.');
  }
}
