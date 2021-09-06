import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService, FavoriteTogglerComponent } from '@helgoland/favorite';
import { TranslateService } from '@ngx-translate/core';

import { SNACK_BAR_CONFIG } from '../../../app.consts';

@Component({
  selector: 'helgoland-favorite-toggle-button',
  templateUrl: './favorite-toggle-button.component.html',
  styleUrls: ['./favorite-toggle-button.component.scss']
})
export class FavoriteToggleButtonComponent extends FavoriteTogglerComponent {

  constructor(
    protected favSrvc: FavoriteService,
    protected translate: TranslateService,
    protected snackBar: MatSnackBar,
    protected liveAnnouncer: LiveAnnouncer
  ) {
    super(favSrvc, translate);
  }

  protected addFavorite() {
    super.addFavorite();
    this.inform(`${this.translate.instant('events.add-favorite')}: ${this.dataset.label}`);
  }

  protected removeFavorite() {
    super.removeFavorite();
    this.inform(`${this.translate.instant('events.remove-favorite')}: ${this.dataset.label}`);
  }

  private inform(message: string) {
    this.liveAnnouncer.announce(message);
    this.snackBar.open(message, this.translate.instant('controls.ok'), SNACK_BAR_CONFIG);
  }

}
