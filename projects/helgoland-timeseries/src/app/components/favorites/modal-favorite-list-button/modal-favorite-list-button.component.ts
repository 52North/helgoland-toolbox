import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { FavoriteService } from '../../../services/favorite.service';
import { ModalFavoriteListComponent } from './../modal-favorite-list/modal-favorite-list.component';

@Component({
  selector: 'helgoland-modal-favorite-list-button',
  templateUrl: './modal-favorite-list-button.component.html',
  styleUrls: ['./modal-favorite-list-button.component.scss']
})
export class ModalFavoriteListButtonComponent {

  constructor(
    private dialog: MatDialog,
    public favoriteSrvc: FavoriteService
  ) { }

  public openFavoriteList() {
    this.dialog.open(ModalFavoriteListComponent, { autoFocus: false, width: '500px' })
  }

}
