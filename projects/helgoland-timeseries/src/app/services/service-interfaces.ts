import { InjectionToken } from '@angular/core';
import { SeriesGraphDataset } from '@helgoland/d3';

import { Favorite } from './favorite.service';

export interface DatasetStateService {
  getPermaId(ds: SeriesGraphDataset): string | undefined;
  validatePermaId(id: string): boolean;
  handleStoredDs(dsId: string): boolean;
}

export const DATASET_STATE_SERVICE_INJECTION = new InjectionToken<
  DatasetStateService[]
>('DATASET_STATE_SERVICE');

export interface DatasetFavoriteService {
  addFavoriteToDiagram(fav: Favorite): void;
  updateFavoriteLabel(fav: Favorite, label: string): void;
  canHandleDatasetAsFavorite(id: string): boolean;
  getFavorites(): Favorite[];
  isFavorite(id: string): boolean;
  getFavorite(id: string): Favorite;
  createFavorite(ds: SeriesGraphDataset): Favorite;
  removeFavorite(id: string): void;
}

export const DATASET_FAVORITE_SERVICE_INJECTION = new InjectionToken<
  DatasetFavoriteService[]
>('DATASET_FAVORITE_SERVICE');
