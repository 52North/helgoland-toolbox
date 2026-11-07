import { TestBed } from '@angular/core/testing';

import { TranslateTestingModule } from '../../../../../testing/translate.testing.module';
import { HelgolandCoreModule } from '../core.module';
import { TzDatePipe } from './tz-date.pipe';

describe('TzDatePipe', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HelgolandCoreModule, TranslateTestingModule],
    }),
  );

  it('create an instance', () => {
    const pipe = TestBed.runInInjectionContext(() => new TzDatePipe());
    expect(pipe).toBeTruthy();
  });
});
