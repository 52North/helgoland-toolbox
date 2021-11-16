import { InjectionToken } from '@angular/core';
import { DatasetEntry } from '@helgoland/d3';

import { Favorite } from './favorite.service';

export interface DatasetPermalinkService {
    noPermalink();
    getPermaIds(): string[];
    validatePermaIds(ids: string[]);
}

export const DATASET_PERMALINK_SERVICE_INJECTION = new InjectionToken<DatasetPermalinkService>('DATASET_PERMALINK_SERVICE');

export interface DatasetFavoriteService {
    addFavoriteToDiagram(fav: Favorite);
    updateFavoriteLabel(fav: Favorite, label: string);
    canHandleDatasetAsFavorite(id: string): boolean;
    getFavorites(): Favorite[];
    isFavorite(id: string): boolean;
    getFavorite(id: string): Favorite;
    createFavorite(ds: DatasetEntry): Favorite;
    removeFavorite(id: string);
}

export const DATASET_FAVORITE_SERVICE_INJECTION = new InjectionToken<DatasetFavoriteService>('DATASET_FAVORITE_SERVICE');
