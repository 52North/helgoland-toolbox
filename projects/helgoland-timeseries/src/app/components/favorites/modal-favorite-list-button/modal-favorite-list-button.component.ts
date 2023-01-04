import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoriteService, HelgolandFavoriteModule } from '@helgoland/favorite';
import { TranslateModule } from '@ngx-translate/core';

import { ModalFavoriteListComponent } from './../modal-favorite-list/modal-favorite-list.component';

@Component({
  selector: 'helgoland-modal-favorite-list-button',
  templateUrl: './modal-favorite-list-button.component.html',
  styleUrls: ['./modal-favorite-list-button.component.scss'],
  imports: [
    CommonModule,
    HelgolandFavoriteModule,
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
  standalone: true
})
export class ModalFavoriteListButtonComponent implements OnInit {

  public favCount = 0;

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
