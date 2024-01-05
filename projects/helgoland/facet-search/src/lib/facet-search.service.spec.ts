import { TestBed, inject } from '@angular/core/testing';

import { FacetSearchServiceImpl } from './facet-search.service';

describe('FacetSearchServiceImpl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacetSearchServiceImpl],
    });
  });

  it('should be created', inject(
    [FacetSearchServiceImpl],
    (service: FacetSearchServiceImpl) => {
      expect(service).toBeTruthy();
    },
  ));
});
