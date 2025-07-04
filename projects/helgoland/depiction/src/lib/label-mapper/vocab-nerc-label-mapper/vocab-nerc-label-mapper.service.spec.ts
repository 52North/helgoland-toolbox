import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { SettingsService } from '@helgoland/core';

import { MockedSettingsService } from '../label-mapper.service.spec';
import { VocabNercLabelMapperService } from './vocab-nerc-label-mapper.service';

describe('Service: VocabNercLabelMapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        VocabNercLabelMapperService,
        { provide: SettingsService, useClass: MockedSettingsService },
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should ...', inject(
    [VocabNercLabelMapperService],
    (service: VocabNercLabelMapperService) => {
      expect(service).toBeTruthy();
    },
  ));
});
