import { async, TestBed } from '@angular/core/testing';
import { HelgolandEventingModule } from './eventing.module';

describe('EventingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HelgolandEventingModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(HelgolandEventingModule).toBeDefined();
  });
});
