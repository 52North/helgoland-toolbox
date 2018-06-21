import { LatLngBoundsLiteral } from 'leaflet';
import { Observable } from 'rxjs/Observable';

export interface GeoSearchResult {
    name: string;
    geometry: GeoJSON.GeoJsonObject;
    bounds?: LatLngBoundsLiteral;
}

export interface GeoSearchOptions {
    countrycodes?: string[];
}

export abstract class GeoSearch {

    public abstract searchTerm(term: string, options?: GeoSearchOptions): Observable<GeoSearchResult>;

}
