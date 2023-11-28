import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandTimeModule } from "./time.module";

describe("TimeModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandTimeModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandTimeModule).toBeDefined();
  });
});
