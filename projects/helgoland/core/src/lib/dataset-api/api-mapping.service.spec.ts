import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { DatasetApiMapping } from './api-mapping.service';

describe('DatasetApiMapping', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        DatasetApiMapping,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    });
  });

  it('should be created', inject(
    [DatasetApiMapping],
    (service: DatasetApiMapping) => {
      expect(service).toBeTruthy();
    },
  ));
});
