import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { HelgolandFacetSearchModule } from './../../facet-search.module';
import { FacetSearchService } from './../../facet-search.service';
import { ParameterFacetComponent } from './parameter-facet.component';

describe('ParameterFacetComponent', () => {
  let component: ParameterFacetComponent;
  let fixture: ComponentFixture<ParameterFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFacetSearchModule]
    }).compileComponents();
  }));

  beforeEach(inject([FacetSearchService], (service: FacetSearchService) => {
    fixture = TestBed.createComponent(ParameterFacetComponent);
    component = fixture.componentInstance;
    component.facetSearchService = service;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
