import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule, SettingsService } from '@helgoland/core';

import { BasicAuthServicesKeeper } from './basic-auth-services-keeper.service';

describe('BasicAuthServicesKeeperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule
      ],
      providers: [
        BasicAuthServicesKeeper,
        SettingsService
      ]
    });
  });

  it('should be created', inject([BasicAuthServicesKeeper], (service: BasicAuthServicesKeeper) => {
    expect(service).toBeTruthy();
  }));
});
