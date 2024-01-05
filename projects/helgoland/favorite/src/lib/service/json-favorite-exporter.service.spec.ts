import { inject, TestBed } from '@angular/core/testing';

import { FavoriteService } from './favorite.service';
import { JsonFavoriteExporterService } from './json-favorite-exporter.service';
import { LocalStorage } from '@helgoland/core';

describe('JsonFavoriteExporterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonFavoriteExporterService, FavoriteService, LocalStorage],
    });
  });

  it('should be created', inject(
    [JsonFavoriteExporterService],
    (service: JsonFavoriteExporterService) => {
      expect(service).toBeTruthy();
    },
  ));
});
