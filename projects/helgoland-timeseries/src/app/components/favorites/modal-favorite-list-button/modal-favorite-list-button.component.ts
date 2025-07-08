import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { FavoriteService } from '../../../services/favorite.service';
import { ModalFavoriteListComponent } from './../modal-favorite-list/modal-favorite-list.component';

@Component({
  selector: 'helgoland-modal-favorite-list-button',
  templateUrl: './modal-favorite-list-button.component.html',
  styleUrls: ['./modal-favorite-list-button.component.scss'],
  imports: [
    MatBadgeModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
    CommonModule,
  ],
})
export class ModalFavoriteListButtonComponent {
  private dialog = inject(MatDialog);
  protected favoriteSrvc = inject(FavoriteService);

  public openFavoriteList() {
    this.dialog.open(ModalFavoriteListComponent, {
      autoFocus: false,
      width: '500px',
    });
  }
}
