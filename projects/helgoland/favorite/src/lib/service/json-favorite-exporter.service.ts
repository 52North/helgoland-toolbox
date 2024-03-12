import { Injectable } from "@angular/core";
import { Observable, Observer } from "rxjs";

import { FavoriteService, GroupFavorite, SingleFavorite } from "./favorite.service";

@Injectable()
export class JsonFavoriteExporterService {

  constructor(
    protected favoriteSrvc: FavoriteService
  ) { }

  public exportFavorites() {
    const filename = "favorites.json";
    const json = {
      singles: this.favoriteSrvc.getFavorites(),
      groups: this.favoriteSrvc.getFavoriteGroups()
    };
    // if (window.navigator.msSaveBlob) {
    //     // IE version >= 10
    //     const blob = new Blob([json], {
    //         type: 'application/json;charset=utf-8;'
    //     });
    //     window.navigator.msSaveBlob(blob, filename);
    // } else {
    // FF, Chrome ...
    const a = document.createElement("a");
    a.href = "data:application/json," + encodeURIComponent(JSON.stringify(json));
    a.target = "_blank";
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
          const json = JSON.parse(result);
          const singles = new Map<string, SingleFavorite>();
          json.singles.forEach((single: SingleFavorite) => singles.set(single.id, single));
          const groups = new Map<string, GroupFavorite>();
          json.groups.forEach((group: GroupFavorite) => groups.set(group.id, group));
          this.favoriteSrvc.setFavorites(singles, groups);
          observer.next(true);
          observer.complete();
        };
      }
    });
  }
}
