import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandFacetSearchModule } from "./facet-search.module";

describe("FacetSearchModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFacetSearchModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandFacetSearchModule).toBeDefined();
  });
});
