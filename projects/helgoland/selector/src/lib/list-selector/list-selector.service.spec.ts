import { TestBed, inject } from "@angular/core/testing";

import { ListSelectorService } from "./list-selector.service";

describe("ListSelectorService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListSelectorService]
    });
  });

  it("should be created", inject([ListSelectorService], (service: ListSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
