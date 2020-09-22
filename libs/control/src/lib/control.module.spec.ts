import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandControlModule } from './control.module';

describe('ControlModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandControlModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandControlModule).toBeDefined();
  });
});
