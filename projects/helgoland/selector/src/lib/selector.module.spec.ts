import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandSelectorModule } from "./selector.module";

describe("SelectorModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandSelectorModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandSelectorModule).toBeDefined();
  });
});
