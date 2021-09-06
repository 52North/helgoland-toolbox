import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HelgolandCoreModule } from '@helgoland/core';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { DiagramViewPermalinkService } from './diagram-view-permalink.service';

describe('DiagramViewPermalinkService', () => {
  let service: DiagramViewPermalinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HelgolandCoreModule,
        RouterTestingModule,
        TranslateTestingModule
      ]
    });
    service = TestBed.inject(DiagramViewPermalinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
