import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';
import { Point } from 'geojson';

import { NominatimGeoSearchService } from './nominatim.service';

describe('NominatimService', () => {

  let nominatimService: NominatimGeoSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule
      ],
      providers: [NominatimGeoSearchService]
    });
  });

  beforeEach(inject([NominatimGeoSearchService], (service: NominatimGeoSearchService) => {
    nominatimService = service;
  }));

  it('should be created', inject([NominatimGeoSearchService], (service: NominatimGeoSearchService) => {
    expect(service).toBeTruthy();
  }));

  // it('should search with point geometry in result', waitForAsync(() => {
  //   nominatimService.searchTerm('gent', {
  //     asPointGeometry: true,
  //     addressdetails: true,
  //     countrycodes: ['be'],
  //     acceptLanguage: 'de'
  //   }).subscribe(res => {
  //     expect(res.geometry.type === 'Point').toBeTruthy();
  //   });
  // }));

  it('should reverse search', waitForAsync(() => {
    const point: Point = {
      type: 'Point',
      coordinates: [51.9350437, 7.6520628]
    };
    nominatimService.reverse(point, {
      acceptLanguage: 'be'
    }).subscribe(res => {
      expect(res.address).toBeTruthy();
    });
  }));

});
