import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DatasetApiInterfaceTesting } from '../../../../../testing/dataset-api-interface.testing';
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
        ServiceSelectorService,
        DatasetApiInterfaceTesting
      ]
    });
  });

  it('should be created', inject([ServiceSelectorService], (service: ServiceSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
