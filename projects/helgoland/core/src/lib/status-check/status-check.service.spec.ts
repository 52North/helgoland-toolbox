import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { StatusCheckService } from './status-check.service';

describe('StatusCheckService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        StatusCheckService
      ]
    });
  });

  it('should be created', inject([StatusCheckService], (service: StatusCheckService) => {
    expect(service).toBeTruthy();
  }));

});
