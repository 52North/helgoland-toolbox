import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandD3Module } from "./d3.module";

describe("D3Module", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandD3Module],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandD3Module).toBeDefined();
  });
});
