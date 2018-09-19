import { Component } from '@angular/core';
import { DatasetApiInterface, DatasetOptions, Timespan } from '@helgoland/core';
import { FavoriteService, JsonFavoriteExporterService, SingleFavorite } from '@helgoland/favorite';

@Component({
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {

  public favorites: ExtendedSingleFavorite[];

  constructor(
    private favoriteSrvc: FavoriteService,
    private jsonExport: JsonFavoriteExporterService,
    private api: DatasetApiInterface
  ) {
    this.api.getSingleTimeseries('26', 'http://www.fluggs.de/sos2/api/v1/').subscribe(dataset => {
      this.favoriteSrvc.addFavorite(dataset);
      this.loadFavorites();
    });
  }

  public changeLabelName(favorite: SingleFavorite) {
    const newLabel = favorite.label + 'Test';
    this.favoriteSrvc.changeLabel(favorite, newLabel);
  }

  public import(event: Event) {
    this.jsonExport.importFavorites(event).subscribe(() => {
      this.loadFavorites();
    });
  }

  public export() {
    this.jsonExport.exportFavorites();
  }

  private loadFavorites() {
    this.favorites = [];
    this.favoriteSrvc.getFavorites().forEach((entry) => {
      const option = new DatasetOptions(entry.favorite.internalId, '#FF0000');
      option.generalize = true;
      const timespan = new Timespan(entry.favorite.lastValue.timestamp - 10000000, entry.favorite.lastValue.timestamp);
      this.favorites.push({
        id: entry.id,
        label: entry.label,
        favorite: entry.favorite,
        timespan,
        option: new Map([[entry.favorite.internalId, option]])
      });
    });
  }
}

interface ExtendedSingleFavorite extends SingleFavorite {
  timespan: Timespan;
  option: Map<string, DatasetOptions>;
}
