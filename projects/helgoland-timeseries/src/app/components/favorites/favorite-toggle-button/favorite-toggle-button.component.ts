import { Component } from '@angular/core';
import { FavoriteTogglerComponent } from '@helgoland/favorite';

@Component({
  selector: 'helgoland-favorite-toggle-button',
  templateUrl: './favorite-toggle-button.component.html',
  styleUrls: ['./favorite-toggle-button.component.scss']
})
export class FavoriteToggleButtonComponent extends FavoriteTogglerComponent {

  public toggle() {
    if (this.isFavorite) {
      this.isFavorite = false;
      this.favSrvc.removeFavorite(this.dataset.internalId);
    } else {
      this.isFavorite = true;
      this.favSrvc.addFavorite(this.dataset, this.options);
    }
  }

}
