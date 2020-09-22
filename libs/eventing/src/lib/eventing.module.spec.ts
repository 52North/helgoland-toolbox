import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandEventingModule } from './eventing.module';

describe('EventingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandEventingModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandEventingModule).toBeDefined();
  });
});
