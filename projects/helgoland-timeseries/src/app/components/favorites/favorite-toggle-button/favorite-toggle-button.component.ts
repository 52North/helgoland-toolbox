import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Input, OnInit } from '@angular/core';
import { SeriesGraphDataset } from '@helgoland/d3';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../../../services/favorite.service';
import { NotifierService } from '../../../services/notifier.service';
import { Required } from '../../../../../../helgoland/core/src/public-api';

@Component({
  selector: 'helgoland-favorite-toggle-button',
  templateUrl: './favorite-toggle-button.component.html',
  styleUrls: ['./favorite-toggle-button.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  standalone: true
})
export class FavoriteToggleButtonComponent implements OnInit {

  @Input() 
  @Required 
  dataset!: SeriesGraphDataset;

  isFavorite = false;
  canBeFavorite = false;

  constructor(
    protected favSrvc: FavoriteService,
    protected translate: TranslateService,
    protected notifier: NotifierService,
    protected liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.canBeFavorite = this.favSrvc.canBeFavorite(this.dataset?.id);
    if (this.canBeFavorite) {
      this.checkFavState();
      this.favSrvc.countChange.subscribe(_ => this.checkFavState());
    }
  }

  private checkFavState() {
    this.isFavorite = this.favSrvc.isFavorite(this.dataset?.id);
  }

  toggle() {
    this.isFavorite ? this.removeFavorite() : this.createFavorite();
  }

  protected createFavorite() {
    this.favSrvc.createFavorite(this.dataset);
    this.isFavorite = true;
    this.inform(`${this.translate.instant('events.add-favorite')}: ${this.dataset.description.phenomenonLabel} @ ${this.dataset.description.platformLabel}`);
  }

  protected removeFavorite() {
    this.favSrvc.removeFavorite(this.dataset.id);
    this.isFavorite = false;
    this.inform(`${this.translate.instant('events.remove-favorite')}: ${this.dataset.description.phenomenonLabel} @ ${this.dataset.description.platformLabel}`);
  }

  private inform(message: string) {
    this.liveAnnouncer.announce(message);
    this.notifier.notify(message);
  }

}
