import { TestBed, inject } from '@angular/core/testing';

import { FacetSearchService } from './facet-search.service';

describe('FacetSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacetSearchService]
    });
  });

  it('should be created', inject([FacetSearchService], (service: FacetSearchService) => {
    expect(service).toBeTruthy();
  }));
});
