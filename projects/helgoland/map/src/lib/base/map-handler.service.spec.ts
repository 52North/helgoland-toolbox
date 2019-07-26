/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing';

import { MapHandlerService } from './map-handler.service';
import { HelgolandMapModule } from './map.module';

describe('Service: MapHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [HelgolandMapModule]
    });
  });

  it('should ...', inject([MapHandlerService], (service: MapHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
