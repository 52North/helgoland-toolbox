import { Injectable } from '@angular/core';
import { DatasetOptions, HelgolandTimeseries, LocalStorage } from '@helgoland/core';
import { Observable, ReplaySubject } from 'rxjs';

export interface Favorite {
  id: string;
  label: string;
}

export interface SingleFavorite extends Favorite {
  favorite: HelgolandTimeseries;
  options: DatasetOptions;
}

function isSingleFavorite(object: any): object is SingleFavorite {
  return 'favorite' in object;
}

export interface GroupFavorite extends Favorite {
  favorites: {
    dataset: HelgolandTimeseries,
    options: DatasetOptions
  }[];
}

function isGroupFavorite(object: any): object is GroupFavorite {
  return 'favorites' in object;
}

const CACHE_PARAM_FAVORITES_SINGLE = 'SingleFavorites';
const CACHE_PARAM_FAVORITES_GROUP = 'GroupFavorites';

@Injectable()
export class FavoriteService {

  private singleFavs: Map<string, SingleFavorite>;
  private groupFavs: Map<string, GroupFavorite>;
  private groupCounter = 0;

  private favoriteCountChanged: ReplaySubject<number> = new ReplaySubject();

  constructor(
    protected localStorage: LocalStorage
  ) {
    this.loadFavorites();
  }

  public addFavorite(dataset: HelgolandTimeseries, options: DatasetOptions, label?: string): boolean {
    if (!this.singleFavs.has(dataset.internalId)) {
      this.singleFavs.set(dataset.internalId, {
        id: dataset.internalId,
        label: label ? label : dataset.label,
        favorite: dataset,
        options
      });
      this.saveFavorites();
      return true;
    }
    return false;
  }

  public getFavoriteCountChanged(): Observable<number> {
    return this.favoriteCountChanged;
  }

  public hasFavorite(dataset: HelgolandTimeseries): boolean {
    return this.singleFavs.has(dataset.internalId);
  }

  public setFavorites(singles: Map<string, SingleFavorite>, groups: Map<string, GroupFavorite>) {
    this.groupFavs = groups;
    this.singleFavs = singles;
    this.saveFavorites();
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

  public addFavoriteGroup(datasets: { dataset: HelgolandTimeseries, options: DatasetOptions }[], label?: string): boolean {
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
    this.updateFavoriteCount();
  }

  private loadFavorites(): void {
    this.singleFavs = new Map();
    this.groupFavs = new Map();
    const loadedSingleFavs = this.localStorage.loadArray<SingleFavorite>(CACHE_PARAM_FAVORITES_SINGLE);
    if (loadedSingleFavs) {
      loadedSingleFavs.forEach((entry) => {
        entry.favorite = this.instanciateClass(entry.favorite);
        this.singleFavs.set(entry.id, entry);
      });
    }
    const loadedGroupFavs = this.localStorage.loadArray<GroupFavorite>(CACHE_PARAM_FAVORITES_GROUP);
    if (loadedGroupFavs) {
      loadedGroupFavs.forEach((entry) => {
        entry.favorites.map(element => {
          return {
            dataset: this.instanciateClass(element.dataset),
            options: element.options
          }
        });
        this.groupFavs.set(entry.id, entry);
      });
    }
    this.updateFavoriteCount();
  }

  private instanciateClass(timeseries: HelgolandTimeseries): HelgolandTimeseries {
    const storedFav = timeseries as HelgolandTimeseries;
    return new HelgolandTimeseries(
      storedFav.id,
      storedFav.url,
      storedFav.label,
      storedFav.uom,
      storedFav.platform,
      storedFav.firstValue,
      storedFav.lastValue,
      storedFav.referenceValues,
      storedFav.renderingHints,
      storedFav.parameters
    );
  }

  private updateFavoriteCount() {
    this.favoriteCountChanged.next(this.singleFavs.size + this.groupFavs.size);
  }
}
