import { Component, OnInit } from '@angular/core';

import { Favorite, FavoriteService } from '../../../services/favorite.service';

interface EditableFavorite extends Favorite {
  editMode: boolean;
}

@Component({
  selector: 'helgoland-modal-favorite-list',
  templateUrl: './modal-favorite-list.component.html',
  styleUrls: ['./modal-favorite-list.component.scss']
})
export class ModalFavoriteListComponent implements OnInit {

  public singles: EditableFavorite[];

  constructor(
    public favoriteSrvc: FavoriteService
  ) { }

  ngOnInit(): void {
    this.setFavorites();
  }


  public addSingleToDiagram(fav: Favorite) {
    this.favoriteSrvc.addFavoriteToDiagram(fav);
  }

  public deleteFav(fav: Favorite) {
    this.favoriteSrvc.removeFavorite(fav.id);
    this.setFavorites();
  }

  public setFavLabel(fav: Favorite, label: string) {
    this.favoriteSrvc.changeLabel(fav, label);
  }

  private setFavorites() {
    this.singles = this.favoriteSrvc.getFavorites().map(e => this.createEditableFavorite(e))
  }

  private createEditableFavorite(fav: Favorite) {
    const ef = fav as EditableFavorite;
    ef.editMode = false;
    return ef;
  }
}
