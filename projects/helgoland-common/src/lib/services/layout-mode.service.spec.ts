import { TestBed } from "@angular/core/testing";

import { LayoutModeService } from "./layout-mode.service";

describe("LayoutModeService", () => {
  let service: LayoutModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutModeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
