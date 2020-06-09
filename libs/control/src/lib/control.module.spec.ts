import { async, TestBed } from '@angular/core/testing';
import { HelgolandControlModule } from './control.module';

describe('ControlModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandControlModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandControlModule).toBeDefined();
  });
});
