import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandFacetSearchModule } from '../../facet-search.module';
import { FacetSearchService } from '../../facet-search.service';
import { ResultListComponent } from './result-list.component';

describe('ResultListComponent', () => {
  let component: ResultListComponent;
  let fixture: ComponentFixture<ResultListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFacetSearchModule],
      declarations: []
    }).compileComponents();
  }));

  beforeEach(inject([FacetSearchService], (service: FacetSearchService) => {
    fixture = TestBed.createComponent(ResultListComponent);
    component = fixture.componentInstance;
    component.facetSearchService = service;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
