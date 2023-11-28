import { Injectable } from "@angular/core";
import * as L from "leaflet";

@Injectable()
export class MapCache {

  private mapCache: Map<string, any> = new Map<string, any>();

  public getMap(id: string): L.Map {
    return this.mapCache.get(id);
  }

  public setMap(id: string, map: L.Map) {
    this.mapCache.set(id, map);
  }

  public hasMap(id: string): boolean {
    return this.mapCache.has(id);
  }

  public deleteMap(id: string): boolean {
    return this.mapCache.delete(id);
  }

}
