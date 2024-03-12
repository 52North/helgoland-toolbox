import { TestBed, inject } from "@angular/core/testing";

import { RangeCalculationsService } from "./range-calculations.service";

describe("RangeCalculationsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RangeCalculationsService]
    });
  });

  it("should be created", inject([RangeCalculationsService], (service: RangeCalculationsService) => {
    expect(service).toBeTruthy();
  }));
});
