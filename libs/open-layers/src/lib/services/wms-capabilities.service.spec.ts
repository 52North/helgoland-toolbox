import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { WmsCapabilitiesService } from './wms-capabilities.service';

describe('WmsCapabilitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HelgolandCoreModule]
  }));

  it('should be created', () => {
    const service: WmsCapabilitiesService = TestBed.inject(WmsCapabilitiesService);
    expect(service).toBeTruthy();
  });

  // it('should be created', (done) => {
  //   inject([], () => {
  //     const service: WmsCapabilitiesService = TestBed.get(WmsCapabilitiesService);
  //     service.getDefaultTimeDimension('dwd:FX-Produkt', 'https://maps.dwd.de/geoserver/ows')
  //       .subscribe(date => {
  //         done();
  //       });
  //   })();
  // });

});
