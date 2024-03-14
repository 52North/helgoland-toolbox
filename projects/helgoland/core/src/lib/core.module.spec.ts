import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandCoreModule } from './core.module';

describe('CoreModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandCoreModule).toBeDefined();
  });
});
