import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class MapCache {
  private mapCache: Map<string, any> = new Map<string, any>();

  getMap(id: string): L.Map {
    return this.mapCache.get(id);
  }

  setMap(id: string, map: L.Map) {
    this.mapCache.set(id, map);
  }

  hasMap(id: string): boolean {
    return this.mapCache.has(id);
  }

  deleteMap(id: string): boolean {
    return this.mapCache.delete(id);
  }
}
