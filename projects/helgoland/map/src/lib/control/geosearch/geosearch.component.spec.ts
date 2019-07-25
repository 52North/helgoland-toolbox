import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HelgolandCoreModule } from '@helgoland/core';

import { GeoSearch, GeoSearchResult } from '../../base/geosearch/geosearch';
import { NominatimGeoSearchService } from '../../base/geosearch/nominatim.service';
import { MapCache } from '../../base/map-cache.service';
import { GeosearchControlComponent } from './geosearch.component';

describe('GeosearchComponent', () => {
  let component: GeosearchControlComponent;
  let fixture: ComponentFixture<GeosearchControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MapCache,
        {
          provide: GeoSearch,
          useClass: NominatimGeoSearchService
        }
      ],
      imports: [
        FormsModule,
        HttpClientModule,
        HelgolandCoreModule
      ],
      declarations: [GeosearchControlComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeosearchControlComponent);
    component = fixture.componentInstance;
    component.mapId = 'mapID';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should search with point geometry in result', () => {
    component.searchTerm = 'gent';
    component.options = {
      asPointGeometry: true
    };
    component.triggerSearch();
    component.onResultChanged.subscribe((res: GeoSearchResult) => {
      expect(res.geometry.type === 'Point').toBeTruthy();
    });
  });

});
