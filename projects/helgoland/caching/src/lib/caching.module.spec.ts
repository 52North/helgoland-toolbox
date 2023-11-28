import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandCachingModule } from "./caching.module";

describe("CachingModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCachingModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandCachingModule).toBeDefined();
  });
});
