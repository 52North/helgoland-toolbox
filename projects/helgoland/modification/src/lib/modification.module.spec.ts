import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandModificationModule } from "./modification.module";

describe("ModificationModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandModificationModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandModificationModule).toBeDefined();
  });
});
