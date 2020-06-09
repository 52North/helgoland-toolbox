import { async, TestBed } from '@angular/core/testing';
import { HelgolandSelectorModule } from './selector.module';

describe('SelectorModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandSelectorModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandSelectorModule).toBeDefined();
  });
});
