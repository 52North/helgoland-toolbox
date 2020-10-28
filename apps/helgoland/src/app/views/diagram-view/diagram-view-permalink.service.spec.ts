import { TestBed } from '@angular/core/testing';

import { DiagramViewPermalinkService } from './diagram-view-permalink.service';

describe('DiagramViewPermalinkService', () => {
  let service: DiagramViewPermalinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagramViewPermalinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
