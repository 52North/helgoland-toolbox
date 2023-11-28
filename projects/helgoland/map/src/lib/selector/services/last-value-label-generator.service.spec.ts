import { TestBed, inject } from "@angular/core/testing";

import { LastValueLabelGeneratorService } from "./last-value-label-generator.service";

describe("LastValueLabelGeneratorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LastValueLabelGeneratorService]
    });
  });

  it("should be created", inject([LastValueLabelGeneratorService], (service: LastValueLabelGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
