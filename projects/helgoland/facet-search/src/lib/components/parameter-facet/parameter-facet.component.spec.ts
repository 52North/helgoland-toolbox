import { FacetSearchService } from './../../facet-search.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { MatchFacetParameterLabelPipe } from '../../pipes/match-facet-parameter-label.pipe';
import { ParameterFacetComponent } from './parameter-facet.component';

describe('ParameterFacetComponent', () => {
  let component: ParameterFacetComponent;
  let fixture: ComponentFixture<ParameterFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParameterFacetComponent, MatchFacetParameterLabelPipe],
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
