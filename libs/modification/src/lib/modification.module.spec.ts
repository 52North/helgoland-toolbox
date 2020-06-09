import { async, TestBed } from '@angular/core/testing';
import { HelgolandModificationModule } from './modification.module';

describe('ModificationModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandModificationModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandModificationModule).toBeDefined();
  });
});
