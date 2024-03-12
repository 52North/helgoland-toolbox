import { InjectionToken } from "@angular/core";
import { SeriesGraphDataset } from "@helgoland/d3";

import { Favorite } from "./favorite.service";

export interface DatasetPermalinkService {
    noPermalink(): void;
    getPermaIds(): string[];
    validatePermaIds(ids: string[]): void;
}

export const DATASET_PERMALINK_SERVICE_INJECTION = new InjectionToken<DatasetPermalinkService>("DATASET_PERMALINK_SERVICE");

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

export const DATASET_FAVORITE_SERVICE_INJECTION = new InjectionToken<DatasetFavoriteService>("DATASET_FAVORITE_SERVICE");
