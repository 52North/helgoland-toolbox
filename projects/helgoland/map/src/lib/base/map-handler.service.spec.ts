/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MapHandlerService } from './map-handler.service';

describe('Service: MapHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapHandlerService]
    });
  });

  it('should ...', inject([MapHandlerService], (service: MapHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
