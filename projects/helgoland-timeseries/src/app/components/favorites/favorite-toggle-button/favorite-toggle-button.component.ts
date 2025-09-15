import { LiveAnnouncer } from '@angular/cdk/a11y';

import { Component, OnInit, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SeriesGraphDataset } from '@helgoland/d3';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../../../services/favorite.service';
import { NotifierService } from '../../../services/notifier.service';

@Component({
  selector: 'helgoland-favorite-toggle-button',
  templateUrl: './favorite-toggle-button.component.html',
  styleUrls: ['./favorite-toggle-button.component.scss'],
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class FavoriteToggleButtonComponent implements OnInit {
  protected favSrvc = inject(FavoriteService);
  protected translate = inject(TranslateService);
  protected notifier = inject(NotifierService);
  protected liveAnnouncer = inject(LiveAnnouncer);

  readonly dataset = input.required<SeriesGraphDataset>();

  isFavorite = false;
  canBeFavorite = false;

  ngOnInit(): void {
    this.canBeFavorite = this.favSrvc.canBeFavorite(this.dataset()?.id);
    if (this.canBeFavorite) {
      this.checkFavState();
      this.favSrvc.countChange.subscribe((_) => this.checkFavState());
    }
  }

  private checkFavState() {
    this.isFavorite = this.favSrvc.isFavorite(this.dataset()?.id);
  }

  toggle() {
    this.isFavorite ? this.removeFavorite() : this.createFavorite();
  }

  protected createFavorite() {
    const dataset = this.dataset();
    this.favSrvc.createFavorite(dataset);
    this.isFavorite = true;
    this.inform(
      `${this.translate.instant('events.add-favorite')}: ${
        dataset.description.phenomenonLabel
      } @ ${dataset.description.platformLabel}`,
    );
  }

  protected removeFavorite() {
    const dataset = this.dataset();
    this.favSrvc.removeFavorite(dataset.id);
    this.isFavorite = false;
    this.inform(
      `${this.translate.instant('events.remove-favorite')}: ${
        dataset.description.phenomenonLabel
      } @ ${dataset.description.platformLabel}`,
    );
  }

  private inform(message: string) {
    this.liveAnnouncer.announce(message);
    this.notifier.notify(message);
  }
}
