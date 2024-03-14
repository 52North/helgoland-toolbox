import { Injectable } from '@angular/core';
import { Map } from 'ol';
import { Observable, of, Subject } from 'rxjs';

/**
 * Service which holds all generated maps and their ids
 */
@Injectable({
  providedIn: 'root',
})
export class OlMapService {
  private map: { [key: string]: any } = {};

  /**
   * Saves id and corresponding map
   *
   * @param mapId
   * @param map
   */
  public setMap(mapId: string, map: Map) {
    if (this.map[mapId] instanceof Subject) {
      const subject = this.map[mapId] as Subject<Map>;
      subject.next(map);
      subject.complete();
    }
    this.map[mapId] = map;
  }

  /**
   * Delivers the corresponding map as observable to the id
   *
   * @param mapId
   * @returns the map as observable
   */
  public getMap(mapId: string): Observable<Map> {
    if (this.map[mapId]) {
      if (this.map[mapId] instanceof Subject) {
        return this.map[mapId];
      } else {
        return of(this.map[mapId]);
      }
    } else {
      this.map[mapId] = new Subject<Map>();
      return this.map[mapId];
    }
  }

  /**
   * Removes the map to the given map id
   *
   * @param id
   */
  public removeMap(id: string): void {
    if (this.map[id]) {
      delete this.map[id];
    }
  }
}
