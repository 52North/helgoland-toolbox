import { TestBed, waitForAsync } from "@angular/core/testing";

import { HelgolandFavoriteModule } from "./favorite.module";

describe("EventingModule", () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandFavoriteModule],
    }).compileComponents();
  }));

  it("should create", () => {
    expect(HelgolandFavoriteModule).toBeDefined();
  });
});
