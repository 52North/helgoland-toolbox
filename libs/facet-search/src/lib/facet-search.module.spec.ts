import { async, TestBed } from '@angular/core/testing';
import { HelgolandFacetSearchModule } from './facet-search.module';

describe('FacetSearchModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFacetSearchModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandFacetSearchModule).toBeDefined();
  });
});
