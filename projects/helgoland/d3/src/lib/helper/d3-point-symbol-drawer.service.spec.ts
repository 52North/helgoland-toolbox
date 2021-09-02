/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { D3PointSymbolDrawerService } from './d3-point-symbol-drawer.service';

describe('Service: D3PointSymbolDrawer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3PointSymbolDrawerService]
    });
  });

  it('should ...', inject([D3PointSymbolDrawerService], (service: D3PointSymbolDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
