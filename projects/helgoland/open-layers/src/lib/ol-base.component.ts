import { AfterViewInit, Directive, Host } from '@angular/core';
import Map from 'ol/Map.js';

import { OlMapService } from './services/map.service';
import { OlMapId } from './services/mapid.service';


/**
 * Defines an abstract class, which must be implemented by every additional component
 */
@Directive()
export abstract class OlBaseComponent implements AfterViewInit {

  /**
   * Creates an instance of OlBaseComponent. A map service and the corresponding map id of the parent map will be injected
   */
  constructor(
    protected mapService: OlMapService,
    @Host() protected mapidService: OlMapId
  ) { }

  /**
   * Subscribes for the initialization of the map after view is initialized
   */
  ngAfterViewInit(): void {
    this.mapidService.getId().subscribe(id => this.mapService.getMap(id).subscribe(map => this.mapInitialized(map)));
  }

  /**
   * This method will be triggered, when the corrsponding map is initialized.
   * @abstract
   * @param {Map} map - the created map
   */
  abstract mapInitialized(map: Map): void;

}
