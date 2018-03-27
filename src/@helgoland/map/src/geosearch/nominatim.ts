import 'rxjs/add/operator/map';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { GeoSearch, GeoSearchOptions, GeoSearchResult } from './geosearch';

interface NominatimResult {
    display_name: string;
    geojson?: GeoJSON.GeoJsonObject;
    lat: string;
    lon: string;
    boundingbox: number[];
}

@Injectable()
export class NominatimGeoSearchService implements GeoSearch {

    constructor(
        private httpClient: HttpClient
    ) { }

    public searchTerm(term: string, options?: GeoSearchOptions): Observable<GeoSearchResult> {
        let params = new HttpParams();
        params = params.set('limit', '1');
        params = params.set('polygon_geojson', '1');
        params = params.set('q', term);
        params = params.set('format', 'json');
        if (options && options.countrycodes) { params = params.set('countrycodes', options.countrycodes.join(',')); }
        return this.httpClient.get(
            'http://nominatim.openstreetmap.org/search',
            { params }
        ).map((resArray: NominatimResult[]) => {
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
                        coordinates: [parseInt(result.lat, 10), parseInt(result.lon, 10)]
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

}
