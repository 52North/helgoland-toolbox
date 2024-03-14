import { TestBed, waitForAsync } from '@angular/core/testing';

import { HelgolandOpenLayersModule } from './open-layers.module';

describe('OpenLayersModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandOpenLayersModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandOpenLayersModule).toBeDefined();
  });
});
