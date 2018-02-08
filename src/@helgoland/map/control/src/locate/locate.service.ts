import { Injectable } from '@angular/core';
import { MapCache } from '@helgoland/map';
import L from 'leaflet';

const LOCATION_FOUND_EVENT = 'locationfound';
const LOCATED_MARKER_ID = 'located';

@Injectable()
export class LocateService {

  constructor(
    private mapCache: MapCache
  ) { }

  public startLocate(id: string) {
    const map = this.mapCache.getMap(id);
    map.on(LOCATION_FOUND_EVENT, (evt: L.LocationEvent) => {
      this.removeMarker(map);
      const marker = L.marker(evt.latlng).addTo(map);
      marker.options.title = LOCATED_MARKER_ID;
    });
    map.locate({
      watch: true,
      setView: true
    });
  }

  public stopLocate(id: string) {
    const map = this.mapCache.getMap(id);
    map.stopLocate();
    map.off(LOCATION_FOUND_EVENT);
    this.removeMarker(map);
  }

  private removeMarker(map: L.Map) {
    map.eachLayer((entry) => {
      if (entry instanceof L.Marker && entry.options.title === LOCATED_MARKER_ID) {
        map.removeLayer(entry);
      }
    });
  }

}
