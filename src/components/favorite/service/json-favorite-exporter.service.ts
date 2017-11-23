import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';

import { FavoriteService, SingleFavorite } from './favorite.service';

@Injectable()
export class JsonFavoriteExporterService {

    constructor(
        private favoriteSrvc: FavoriteService
    ) { }

    public exportFavorites() {
        const filename = 'favorites.json';
        const json = JSON.stringify(this.favoriteSrvc.getFavorites());
        // if (window.navigator.msSaveBlob) {
        //     // IE version >= 10
        //     const blob = new Blob([json], {
        //         type: 'application/json;charset=utf-8;'
        //     });
        //     window.navigator.msSaveBlob(blob, filename);
        // } else {
        // FF, Chrome ...
        const a = document.createElement('a');
        a.href = 'data:application/json,' + encodeURIComponent(json);
        a.target = '_blank';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        // }
    }

    public importFavorites(event: any): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                this.favoriteSrvc.removeAllFavorites();
                const reader = new FileReader();
                reader.readAsText(files[0]);
                reader.onerror = () => {
                    // alertService.error($translate.instant('favorite.import.wrongFile'));
                };
                reader.onload = (e: any) => {
                    const result = e.target.result;
                    const favorites = JSON.parse(result) as SingleFavorite[];
                    favorites.forEach((entry) => {
                        this.favoriteSrvc.addFavorite(entry.favorite, entry.label);
                    });
                    observer.next(true);
                    observer.complete();
                };
            }
        });
    }
}
