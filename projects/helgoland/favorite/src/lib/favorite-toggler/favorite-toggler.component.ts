import { NgClass } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatasetOptions, HelgolandTimeseries } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'n52-favorite-toggler',
  templateUrl: './favorite-toggler.component.html',
  standalone: true,
  imports: [NgClass],
})
export class FavoriteTogglerComponent implements OnChanges {
  @Input({ required: true })
  public dataset!: HelgolandTimeseries;

  @Input({ required: true })
  public options!: DatasetOptions;

  public isFavorite: boolean = false;

  constructor(
    protected favSrvc: FavoriteService,
    protected translate: TranslateService,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataset'] && this.dataset) {
      this.isFavorite = this.favSrvc.hasFavorite(this.dataset);
    }
  }

  public toggle() {
    if (this.isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }

  protected addFavorite() {
    this.isFavorite = true;
    this.favSrvc.addFavorite(this.dataset, this.options);
  }

  protected removeFavorite() {
    this.isFavorite = false;
    this.favSrvc.removeFavorite(this.dataset.internalId);
  }
}
