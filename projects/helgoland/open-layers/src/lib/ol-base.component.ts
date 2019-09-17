import { AfterViewInit, Host } from '@angular/core';
import Map from 'ol/Map.js';

import { OlMapService } from './services/map.service';
import { OlMapId } from './services/mapid.service';


export abstract class OlBaseComponent implements AfterViewInit {

  constructor(
    protected mapService: OlMapService,
    @Host() protected mapidService: OlMapId
  ) { }

  ngAfterViewInit(): void {
    this.mapidService.getId().subscribe(id => this.mapService.getMap(id).subscribe(map => this.mapInitialized(map)));
  }

  abstract mapInitialized(map: Map);

}
