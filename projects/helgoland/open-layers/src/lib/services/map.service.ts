import { Injectable } from '@angular/core';
import { Map } from 'ol';
import { Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OlMapService {

  private map = {};

  public setMap(id: string, map: Map) {
    if (this.map[id] instanceof Subject) {
      const subject = this.map[id] as Subject<Map>;
      subject.next(map);
      subject.complete();
    }
    this.map[id] = map;
  }

  public getMap(id: string): Observable<Map> {
    if (this.map[id]) {
      if (this.map[id] instanceof Subject) {
        return this.map[id];
      } else {
        return of(this.map[id]);
      }
    } else {
      this.map[id] = new Subject<Map>();
      return this.map[id];
    }
  }

}
