import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { SettingsService } from '@helgoland/core';

import { LabelMapperService } from './label-mapper.service';

describe('LabelMapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [LabelMapperService, SettingsService]
    });
  });

  it('should be created', inject([LabelMapperService], (service: LabelMapperService) => {
    expect(service).toBeTruthy();
  }));
});
