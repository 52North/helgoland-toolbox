import { async, TestBed } from '@angular/core/testing';
import { HelgolandCoreModule } from './core.module';

describe('CoreModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandCoreModule).toBeDefined();
  });
});
