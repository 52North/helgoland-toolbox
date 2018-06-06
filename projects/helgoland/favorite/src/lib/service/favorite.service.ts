import { Injectable } from '@angular/core';
import { IDataset, LocalStorage } from '@helgoland/core';

const CACHE_PARAM_FAVORITES_SINGLE = 'SingleFavorites';
const CACHE_PARAM_FAVORITES_GROUP = 'GroupFavorites';

@Injectable()
export class FavoriteService {

  private singleFavs: Map<string, SingleFavorite>;
  private groupFavs: Map<string, GroupFavorite>;
  private groupCounter: number = 0;

  constructor(
    protected localStorage: LocalStorage
  ) {
    this.loadFavorites();
  }

  public addFavorite(dataset: IDataset, label?: string): boolean {
    if (!this.singleFavs.has(dataset.internalId)) {
      this.singleFavs.set(dataset.internalId, {
        id: dataset.internalId,
        label: label ? label : dataset.label,
        favorite: dataset
      });
      this.saveFavorites();
      return true;
    }
    return false;
  }

  public hasFavorite(dataset: IDataset): boolean {
    return this.singleFavs.has(dataset.internalId);
  }

  public getFavorites(): SingleFavorite[] {
    return Array.from(this.singleFavs.values());
  }

  public removeFavorite(favoriteId: string): boolean {
    if (this.singleFavs.has(favoriteId)) {
      this.singleFavs.delete(favoriteId);
      this.saveFavorites();
      return true;
    }
    if (this.groupFavs.has(favoriteId)) {
      this.groupFavs.delete(favoriteId);
      this.saveFavorites();
      return true;
    }
    return false;
  }

  public addFavoriteGroup(datasets: IDataset[], label?: string): boolean {
    const id = 'Group' + this.groupCounter++;
    this.groupFavs.set(id, {
      id,
      label: label ? label : id,
      favorites: datasets
    });
    this.saveFavorites();
    return true;
  }

  public getFavoriteGroups(): GroupFavorite[] {
    return Array.from(this.groupFavs.values());
  }

  public removeAllFavorites(): boolean {
    this.singleFavs.clear();
    this.groupFavs.clear();
    this.saveFavorites();
    return true;
  }

  public changeLabel(favorite: Favorite, label: string) {
    favorite.label = label;
    if (isSingleFavorite(favorite)) { this.singleFavs.set(favorite.id, favorite); }
    if (isGroupFavorite(favorite)) { this.groupFavs.set(favorite.id, favorite); }
    this.saveFavorites();
  }

  private saveFavorites(): void {
    this.localStorage.save(CACHE_PARAM_FAVORITES_SINGLE, this.getFavorites());
    this.localStorage.save(CACHE_PARAM_FAVORITES_GROUP, this.getFavoriteGroups());
  }

  private loadFavorites(): void {
    this.singleFavs = new Map();
    this.groupFavs = new Map();
    this.localStorage.loadArray<SingleFavorite>(CACHE_PARAM_FAVORITES_SINGLE)
      .forEach((entry) => this.singleFavs.set(entry.id, entry));
    this.localStorage.loadArray<GroupFavorite>(CACHE_PARAM_FAVORITES_GROUP)
      .forEach((entry) => this.groupFavs.set(entry.id, entry));
  }
}

export interface Favorite {
  id: string;
  label: string;
}

export interface SingleFavorite extends Favorite {
  favorite: IDataset;
}

function isSingleFavorite(object: any): object is SingleFavorite {
  return 'favorite' in object;
}

export interface GroupFavorite extends Favorite {
  favorites: IDataset[];
}

function isGroupFavorite(object: any): object is GroupFavorite {
  return 'favorites' in object;
}
