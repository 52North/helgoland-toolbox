import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetSearchComponent } from './facet-search.component';

describe('FacetSearchComponent', () => {
  let component: FacetSearchComponent;
  let fixture: ComponentFixture<FacetSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
