import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { IDataset } from '../../..';
import { FavoriteService } from '../service/favorite.service';

@Component({
    selector: 'n52-favorite-toggler',
    templateUrl: './favorite-toggler.component.html'
})
export class FavoriteTogglerComponent implements OnChanges {

    @Input()
    public dataset: IDataset;

    public isFavorite: boolean;

    constructor(
        private favSrvc: FavoriteService
    ) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataset && this.dataset) {
            this.isFavorite = this.favSrvc.hasFavorite(this.dataset);
        }
    }

    public toggle() {
        if (this.isFavorite) {
            this.isFavorite = false;
            this.favSrvc.removeFavorite(this.dataset.internalId);
        } else {
            this.isFavorite = true;
            this.favSrvc.addFavorite(this.dataset);
        }
    }
}
