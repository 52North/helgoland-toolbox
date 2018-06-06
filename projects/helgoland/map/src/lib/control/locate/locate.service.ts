import { Injectable } from '@angular/core';
import L from 'leaflet';

import { MapCache } from '../../base/map-cache.service';

const LOCATION_FOUND_EVENT = 'locationfound';
const LOCATION_ERROR = 'locationerror';
const LOCATED_MARKER_ID = 'located';

@Injectable()
export class LocateService {

  constructor(
    protected mapCache: MapCache
  ) { }

  public startLocate(id: string) {
    const map = this.mapCache.getMap(id);
    map.on(LOCATION_FOUND_EVENT, (evt: L.LocationEvent) => {
      this.removeMarker(map);
      const marker = L.marker(evt.latlng).addTo(map);
      marker.options.title = LOCATED_MARKER_ID;
    });
    map.on(LOCATION_ERROR, (error) => {
      console.error(error);
    });
    map.locate({
      watch: true,
      setView: true,
      timeout: 30000
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
