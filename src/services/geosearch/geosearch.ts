import { LatLngBoundsLiteral } from 'leaflet';
import { Observable } from 'rxjs/Rx';

export interface GeoSearchResult {
    name: string;
    geometry: GeoJSON.GeoJsonObject;
    bounds?: LatLngBoundsLiteral;
}

export abstract class GeoSearch {

    public abstract searchTerm(term: string): Observable<GeoSearchResult>;

}
