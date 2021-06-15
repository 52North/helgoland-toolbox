import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { HelgolandMapModule } from '@helgoland/map';

import { FacetSearchService } from '../../facet-search-model';
import { HelgolandFacetSearchModule } from '../../facet-search.module';
import { ResultMapComponent } from './result-map.component';

describe('ResultMapComponent', () => {
  let component: ResultMapComponent;
  let fixture: ComponentFixture<ResultMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandMapModule, HelgolandFacetSearchModule],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(inject([FacetSearchService], (service: FacetSearchService) => {
    fixture = TestBed.createComponent(ResultMapComponent);
    component = fixture.componentInstance;
    component.facetSearchService = service;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
