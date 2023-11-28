import { inject, TestBed } from "@angular/core/testing";
import { HelgolandCoreModule, SettingsService } from "@helgoland/core";

import { BasicAuthServiceMaintainer } from "./basic-auth-service-maintainer.service";

describe("BasicAuthServicesKeeperService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ],
      providers: [
        BasicAuthServiceMaintainer,
        SettingsService
      ]
    });
  });

  it("should be created", inject([BasicAuthServiceMaintainer], (service: BasicAuthServiceMaintainer) => {
    expect(service).toBeTruthy();
  }));
});
