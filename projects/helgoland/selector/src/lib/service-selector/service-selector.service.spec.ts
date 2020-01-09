import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { ServiceSelectorService } from './service-selector.service';

describe('ServiceSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HelgolandCoreModule,
        TranslateTestingModule
      ],
      providers: [
        ServiceSelectorService
      ]
    });
  });

  it('should be created', inject([ServiceSelectorService], (service: ServiceSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
