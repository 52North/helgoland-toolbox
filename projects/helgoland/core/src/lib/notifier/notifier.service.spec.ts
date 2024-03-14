import { inject, TestBed } from '@angular/core/testing';

import { NotifierService } from './notifier.service';

describe('NotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotifierService],
    });
  });

  it('should be created', inject(
    [NotifierService],
    (service: NotifierService) => {
      expect(service).toBeTruthy();
    },
  ));
});
