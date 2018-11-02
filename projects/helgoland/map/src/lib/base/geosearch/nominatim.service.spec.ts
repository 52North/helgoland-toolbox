import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Point } from 'geojson';

import { NominatimGeoSearchService } from './nominatim.service';

describe('NominatimService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [NominatimGeoSearchService]
    });
  });

  it('should be created', inject([NominatimGeoSearchService], (service: NominatimGeoSearchService) => {
    expect(service).toBeTruthy();
  }));

  it('should search with point geometry in result', inject([NominatimGeoSearchService], (service: NominatimGeoSearchService) => {
    service.searchTerm('gent', {
      asPointGeometry: true,
      addressdetails: true
    }).subscribe(res => {
      expect(res.geometry.type === 'Point').toBeTruthy();
    });
  }));

  it('should reverse search', inject([NominatimGeoSearchService], (service: NominatimGeoSearchService) => {
    const point: Point = {
      type: 'Point',
      coordinates: [51.9350437, 7.6520628]
    };
    service.reverse(point).subscribe(res => {
        expect(res.address).toBeTruthy();
    });
  }));

});
