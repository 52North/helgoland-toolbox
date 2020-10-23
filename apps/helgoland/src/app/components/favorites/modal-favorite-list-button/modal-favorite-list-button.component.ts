import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteService } from '@helgoland/favorite';

import { ModalFavoriteListComponent } from './../modal-favorite-list/modal-favorite-list.component';

@Component({
  selector: 'helgoland-toolbox-modal-favorite-list-button',
  templateUrl: './modal-favorite-list-button.component.html',
  styleUrls: ['./modal-favorite-list-button.component.scss']
})
export class ModalFavoriteListButtonComponent implements OnInit {

  public favCount: number;

  constructor(
    private dialog: MatDialog,
    public favoriteSrvc: FavoriteService
  ) { }

  ngOnInit(): void {
    this.favoriteSrvc.getFavoriteCountChanged().subscribe(c => this.favCount = c)
  }

  public openFavoriteList() {
    this.dialog.open(ModalFavoriteListComponent, { autoFocus: false, width: '500px' })
  }

}
