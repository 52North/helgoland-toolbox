import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { Favorite, FavoriteService } from '../../../services/favorite.service';
import { EditLabelComponent } from '../../edit-label/edit-label.component';

interface EditableFavorite extends Favorite {
  editMode: boolean;
}

@Component({
  selector: 'helgoland-modal-favorite-list',
  templateUrl: './modal-favorite-list.component.html',
  styleUrls: ['./modal-favorite-list.component.scss'],
  imports: [
    TranslateModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    EditLabelComponent,
  ],
})
export class ModalFavoriteListComponent implements OnInit {
  favoriteSrvc = inject(FavoriteService);

  singles: EditableFavorite[] = [];

  ngOnInit(): void {
    this.setFavorites();
  }

  addSingleToDiagram(fav: Favorite) {
    this.favoriteSrvc.addFavoriteToDiagram(fav);
  }

  deleteFav(fav: Favorite) {
    this.favoriteSrvc.removeFavorite(fav.id);
    this.setFavorites();
  }

  setFavLabel(fav: Favorite, label: string) {
    this.favoriteSrvc.changeLabel(fav, label);
  }

  private setFavorites() {
    this.singles = this.favoriteSrvc
      .getFavorites()
      .map((e) => this.createEditableFavorite(e));
  }

  private createEditableFavorite(fav: Favorite) {
    const ef = fav as EditableFavorite;
    ef.editMode = false;
    return ef;
  }
}
