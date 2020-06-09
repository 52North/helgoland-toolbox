import { TestBed } from '@angular/core/testing';

import { D3DataSimpleGeneralizer } from './d3-data-simple-generalizer.service';

describe('D3DataSimpleGeneralizer', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [D3DataSimpleGeneralizer]
  }));

  it('should be created', () => {
    const service: D3DataSimpleGeneralizer = TestBed.get(D3DataSimpleGeneralizer);
    expect(service).toBeTruthy();
  });
});
