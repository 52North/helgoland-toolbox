import { async, TestBed } from '@angular/core/testing';
import { HelgolandTimeModule } from './time.module';

describe('TimeModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandTimeModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandTimeModule).toBeDefined();
  });
});
