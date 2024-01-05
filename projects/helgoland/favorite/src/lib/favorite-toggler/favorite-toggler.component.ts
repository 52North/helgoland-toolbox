import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatasetOptions, HelgolandTimeseries, Required } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../service/favorite.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'n52-favorite-toggler',
  templateUrl: './favorite-toggler.component.html',
  standalone: true,
  imports: [NgClass],
})
export class FavoriteTogglerComponent implements OnChanges {
  @Input()
  @Required
  public dataset!: HelgolandTimeseries;

  @Input()
  @Required
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
