import { Point } from 'geojson';
import { LatLngBoundsLiteral } from 'leaflet';
import { Observable } from 'rxjs/Observable';

export interface GeoSearchResult {
    name: string;
    geometry: GeoJSON.GeoJsonObject;
    bounds?: LatLngBoundsLiteral;
}

export interface GeoSearchOptions {
    countrycodes?: string[];
    asPointGeometry?: boolean;
}

export interface GeoReverseOptions {
    addressdetails?: boolean;
    zoom?: number;
}

export interface GeoReverseResult {
    lat: string;
    lon: string;
    displayName?: string;
    address?: {
        houseNumber: string;
        road: string;
        neighbourhood: string;
        suburb: string;
        cityDistrict: string;
        city: string;
        county: string;
        stateDistrict: string;
        state: string;
        postcode: string;
        country: string;
        countryCode: string;
    };
    boundingbox?: string[];
}

export abstract class GeoSearch {

    public abstract searchTerm(term: string, options?: GeoSearchOptions): Observable<GeoSearchResult>;

    public abstract reverse(point: Point, options?: GeoReverseOptions): Observable<GeoReverseResult>;

}
