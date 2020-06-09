import { async, TestBed } from '@angular/core/testing';
import { HelgolandCachingModule } from './caching.module';

describe('CachingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCachingModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandCachingModule).toBeDefined();
  });
});
