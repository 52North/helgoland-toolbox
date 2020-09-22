import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandPermalinkModule } from './permalink.module';

describe('PermalinkModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandPermalinkModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandPermalinkModule).toBeDefined();
  });
});
