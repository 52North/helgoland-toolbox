import { Inject, Injectable, Optional } from '@angular/core';
import { DatasetDescription, SeriesGraphDataset } from '@helgoland/d3';
import { BehaviorSubject } from 'rxjs';

import { DATASET_FAVORITE_SERVICE_INJECTION, DatasetFavoriteService } from './service-interfaces';

export interface Favorite {
  id: string;
  label: string;
  description: DatasetDescription
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  public countChange: BehaviorSubject<number> = new BehaviorSubject(0);

  constructor(
    @Optional() @Inject(DATASET_FAVORITE_SERVICE_INJECTION) private favoriteServices: DatasetFavoriteService[] | null = []
  ) {
    if (this.favoriteServices === null) { this.favoriteServices = [] }
    this.updateFavCount();
  }

  canBeFavorite(id: string): boolean {
    return this.findService(id) !== null;
  }

  isFavorite(id: string): boolean {
    return this.findService(id).isFavorite(id);
  }

  removeFavorite(id: string) {
    this.findService(id).removeFavorite(id);
    this.updateFavCount();
  }

  createFavorite(dataset: SeriesGraphDataset) {
    const favorite = this.findService(dataset.id).createFavorite(dataset);
    this.updateFavCount();
  }

  getFavorites(): Favorite[] {
    const favorites = [];
    this.favoriteServices.map(srv => favorites.push(...srv.getFavorites()));
    return favorites;
  }

  changeLabel(fav: Favorite, label: string) {
    this.findService(fav.id).updateFavoriteLabel(fav, label);
  }

  addFavoriteToDiagram(fav: Favorite) {
    this.findService(fav.id).addFavoriteToDiagram(fav);
  }

  private updateFavCount() {
    const favCount = this.getFavorites().length;
    this.countChange.next(favCount);
  }

  private findService(id: string) {
    return this.favoriteServices.find(e => e.canHandleDatasetAsFavorite(id));
  }

}
