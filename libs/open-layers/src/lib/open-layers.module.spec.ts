import { async, TestBed } from '@angular/core/testing';

import { HelgolandOpenLayersModule } from './open-layers.module';

describe('OpenLayersModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandOpenLayersModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandOpenLayersModule).toBeDefined();
  });
});
