import { NgClass } from '@angular/common';
import {
  Component,
  OnChanges,
  SimpleChanges,
  inject,
  input,
} from '@angular/core';
import { DatasetOptions, HelgolandTimeseries } from '@helgoland/core';
import { TranslateService } from '@ngx-translate/core';

import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'n52-favorite-toggler',
  templateUrl: './favorite-toggler.component.html',
  imports: [NgClass],
})
export class FavoriteTogglerComponent implements OnChanges {
  protected favSrvc = inject(FavoriteService);
  protected translate = inject(TranslateService);

  readonly dataset = input.required<HelgolandTimeseries>();

  readonly options = input.required<DatasetOptions>();

  isFavorite: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    const dataset = this.dataset();
    if (changes['dataset'] && dataset) {
      this.isFavorite = this.favSrvc.hasFavorite(dataset);
    }
  }

  toggle() {
    if (this.isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }

  protected addFavorite() {
    this.isFavorite = true;
    this.favSrvc.addFavorite(this.dataset(), this.options());
  }

  protected removeFavorite() {
    this.isFavorite = false;
    this.favSrvc.removeFavorite(this.dataset().internalId);
  }
}
