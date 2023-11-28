import { TestBed, inject } from "@angular/core/testing";

import { FavoriteService } from "./favorite.service";
import { LocalStorage } from "@helgoland/core";

describe("FavoriteService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteService,
        LocalStorage
      ]
    });
  });

  it("should be created", inject([FavoriteService], (service: FavoriteService) => {
    expect(service).toBeTruthy();
  }));
});
