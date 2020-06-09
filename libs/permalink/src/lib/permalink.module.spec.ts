import { async, TestBed } from '@angular/core/testing';
import { HelgolandPermalinkModule } from './permalink.module';

describe('PermalinkModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandPermalinkModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandPermalinkModule).toBeDefined();
  });
});
