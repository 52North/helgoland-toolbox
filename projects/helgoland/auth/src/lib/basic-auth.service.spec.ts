import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { BasicAuthService } from './basic-auth.service';

describe('BasicAuthService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        BasicAuthService
      ]
    });
  });

  it('should be created', inject([BasicAuthService], (service: BasicAuthService) => {
    expect(service).toBeTruthy();
  }));

});
