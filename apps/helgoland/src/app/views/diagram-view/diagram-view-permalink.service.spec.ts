import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { DiagramViewPermalinkService } from './diagram-view-permalink.service';

describe('DiagramViewPermalinkService', () => {
  let service: DiagramViewPermalinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        RouterTestingModule
      ]
    });
    service = TestBed.inject(DiagramViewPermalinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
