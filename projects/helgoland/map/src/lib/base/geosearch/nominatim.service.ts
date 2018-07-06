import 'rxjs/add/operator/map';

import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '@helgoland/core';
import { Point } from 'geojson';
import { Observable } from 'rxjs/Observable';

import { GeoReverseOptions, GeoReverseResult, GeoSearch, GeoSearchOptions, GeoSearchResult } from './geosearch';

interface NominatimSearchResult {
    display_name: string;
    geojson?: GeoJSON.GeoJsonObject;
    lat: string;
    lon: string;
    boundingbox: number[];
}

export interface Address {
    address29: string;
    house_number: string;
    road: string;
    neighbourhood: string;
    suburb: string;
    city_district: string;
    city: string;
    county: string;
    state_district: string;
    state: string;
    postcode: string;
    country: string;
    country_code: string;
}

export interface NominatimReverseResult {
    place_id: string;
    licence: string;
    osm_type: string;
    osm_id: string;
    lat: string;
    lon: string;
    display_name: string;
    address: Address;
    boundingbox: string[];
}

@Injectable()
export class NominatimGeoSearchService implements GeoSearch {

    protected serviceUrl = 'https://nominatim.openstreetmap.org/';

    constructor(
        protected http: HttpService
    ) { }

    public searchTerm(term: string, options?: GeoSearchOptions): Observable<GeoSearchResult> {
        let params = new HttpParams();
        params = params.set('limit', '1');
        params = params.set('polygon_geojson', options.asPointGeometry ? '0' : '1');
        params = params.set('q', term);
        params = params.set('format', 'json');
        if (options && options.countrycodes) { params = params.set('countrycodes', options.countrycodes.join(',')); }
        return this.http.client().get(
            this.serviceUrl + 'search',
            { params }
        ).map((resArray: NominatimSearchResult[]) => {
            if (resArray.length === 1) {
                const result = resArray[0];
                const name = result.display_name;
                let bounds: Array<[number, number]>;
                if (result.boundingbox) {
                    bounds = [
                        [
                            result.boundingbox[0],
                            result.boundingbox[2]
                        ],
                        [
                            result.boundingbox[1],
                            result.boundingbox[3]
                        ]
                    ];
                } else {
                    bounds = null;
                }
                let geometry;
                if (result.geojson) {
                    geometry = result.geojson;
                } else {
                    geometry = {
                        type: 'Point',
                        coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
                    };
                }
                return {
                    name,
                    geometry,
                    bounds
                };
            }
        });
    }

    public reverse(point: Point, options?: GeoReverseOptions): Observable<GeoReverseResult> {
        let params = new HttpParams();
        params = params.set('lat', point.coordinates[0].toString());
        params = params.set('lon', point.coordinates[1].toString());
        params = params.set('format', 'json');
        return this.http.client().get(
            this.serviceUrl + 'reverse',
            { params }
        ).map((res: NominatimReverseResult) => {
            return {
                lat: res.lat,
                lon: res.lon,
                displayName: res.display_name,
                address: {
                    city: res.address.city,
                    cityDistrict: res.address.city_district,
                    country: res.address.country,
                    countryCode: res.address.country_code,
                    county: res.address.county,
                    houseNumber: res.address.house_number,
                    neighbourhood: res.address.neighbourhood,
                    postcode: res.address.postcode,
                    road: res.address.road,
                    state: res.address.state,
                    stateDistrict: res.address.state_district,
                    suburb: res.address.suburb
                },
                boundingbox: res.boundingbox
            } as GeoReverseResult;
        });
    }

}
