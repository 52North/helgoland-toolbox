import { HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { Settings } from '../model/settings/settings';
import { SettingsService } from '../settings/settings.service';
import { StatusCheckService } from './status-check.service';

@Injectable()
export class ExtendedSettingsService extends SettingsService<Settings> {
  constructor() {
    super();
    this.setSettings({});
  }
}

describe('StatusCheckService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        StatusCheckService,
        SettingsService
      ]
    });
  });

  it('should be created', inject([StatusCheckService], (service: StatusCheckService) => {
    expect(service).toBeTruthy();
  }));

});
